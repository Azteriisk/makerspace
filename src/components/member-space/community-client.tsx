"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"
import { useReducer, useSpacetimeDB, useTable } from "spacetimedb/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
    demoAccessRules,
    demoCategories,
    demoChannels,
    demoGroups,
    demoMemberships,
    demoMessages,
    demoParticipants,
    demoProfiles,
    demoThreads,
} from "@/lib/member-space/demo-data"
import {
    canPostInChannel,
    canViewChannel,
    getCurrentProfile,
    getOtherParticipant,
    getUserGroupSlugs,
    mapCategories,
    mapChannels,
    mapGroups,
    mapMemberships,
    mapMessages,
    mapParticipants,
    mapProfiles,
    mapRules,
    mapThreads,
} from "@/lib/member-space/utils"
import { reducers, tables } from "@/module_bindings"
import { Hash, Lock, MessageCircleMore, Send, ShieldCheck } from "lucide-react"

type ActiveTarget =
    | { type: "channel", id: string }
    | { type: "dm", id: string }

function getFallbackRole(siteRole: unknown) {
    return siteRole === "owner" || siteRole === "admin" || siteRole === "moderator" || siteRole === "member"
        ? siteRole
        : undefined
}

export function CommunityClient() {
    const { user } = useUser()
    const connection = useSpacetimeDB()
    const [profileRows, profilesReady] = useTable(tables.member_profile)
    const [groupRows] = useTable(tables.member_group)
    const [membershipRows] = useTable(tables.member_group_membership)
    const [categoryRows] = useTable(tables.channel_category)
    const [channelRows] = useTable(tables.channel)
    const [ruleRows] = useTable(tables.channel_access_rule)
    const [messageRows] = useTable(tables.message)
    const [threadRows] = useTable(tables.dm_thread)
    const [participantRows] = useTable(tables.dm_participant)

    const profiles = React.useMemo(() => (profilesReady || profileRows.length > 0 ? mapProfiles(profileRows) : demoProfiles), [profileRows, profilesReady])
    const groups = React.useMemo(() => (groupRows.length > 0 ? mapGroups(groupRows) : demoGroups), [groupRows])
    const memberships = React.useMemo(() => (membershipRows.length > 0 ? mapMemberships(membershipRows) : demoMemberships), [membershipRows])
    const categories = React.useMemo(() => (categoryRows.length > 0 ? mapCategories(categoryRows) : demoCategories), [categoryRows])
    const channels = React.useMemo(() => (channelRows.length > 0 ? mapChannels(channelRows) : demoChannels), [channelRows])
    const rules = React.useMemo(() => (ruleRows.length > 0 ? mapRules(ruleRows) : demoAccessRules), [ruleRows])
    const messages = React.useMemo(() => (messageRows.length > 0 ? mapMessages(messageRows) : demoMessages), [messageRows])
    const threads = React.useMemo(() => (threadRows.length > 0 ? mapThreads(threadRows) : demoThreads), [threadRows])
    const participants = React.useMemo(() => (participantRows.length > 0 ? mapParticipants(participantRows) : demoParticipants), [participantRows])

    const currentProfile = getCurrentProfile(profiles, user?.id ?? null, {
        displayName: user?.fullName ?? user?.username ?? "MakerSpace Member",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        avatarUrl: user?.imageUrl ?? "",
        role: getFallbackRole(user?.publicMetadata?.siteRole),
    })
    const viewerGroupSlugs = getUserGroupSlugs(groups, memberships, currentProfile?.clerkId ?? null)
    const visibleChannels = channels
        .filter(channel => !channel.isArchived)
        .filter(channel => canViewChannel(channel, rules, currentProfile, viewerGroupSlugs))
        .sort((a, b) => a.sortOrder - b.sortOrder)
    const visibleThreads = threads.filter(thread => currentProfile && [thread.userAClerkId, thread.userBClerkId].includes(currentProfile.clerkId))

    const [activeTarget, setActiveTarget] = React.useState<ActiveTarget | null>(null)
    const [draftMessage, setDraftMessage] = React.useState("")

    const createDmThread = useReducer(reducers.createDmThread)
    const sendMessage = useReducer(reducers.sendMessage)
    const markThreadRead = useReducer(reducers.markThreadRead)

    React.useEffect(() => {
        if (!visibleChannels.length && !visibleThreads.length) {
            setActiveTarget(null)
            return
        }

        if (!activeTarget) {
            setActiveTarget(visibleChannels[0] ? { type: "channel", id: visibleChannels[0].id } : { type: "dm", id: visibleThreads[0].id })
            return
        }

        const isStillValid = activeTarget.type === "channel"
            ? visibleChannels.some(channel => channel.id === activeTarget.id)
            : visibleThreads.some(thread => thread.id === activeTarget.id)

        if (!isStillValid) {
            setActiveTarget(visibleChannels[0] ? { type: "channel", id: visibleChannels[0].id } : { type: "dm", id: visibleThreads[0].id })
        }
    }, [activeTarget, visibleChannels, visibleThreads])

    React.useEffect(() => {
        if (!connection.isActive || !currentProfile || activeTarget?.type !== "dm") {
            return
        }

        void markThreadRead({
            actorClerkId: currentProfile.clerkId,
            threadId: BigInt(activeTarget.id),
        })
    }, [activeTarget, connection.isActive, currentProfile, markThreadRead])

    const groupedChannels = categories
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(category => ({
            category,
            channels: visibleChannels.filter(channel => channel.categoryId === category.id),
        }))
        .filter(group => group.channels.length > 0)

    const activeChannel = activeTarget?.type === "channel"
        ? visibleChannels.find(channel => channel.id === activeTarget.id) ?? null
        : null
    const activeThread = activeTarget?.type === "dm"
        ? visibleThreads.find(thread => thread.id === activeTarget.id) ?? null
        : null
    const activeMessages = messages
        .filter(message => activeChannel ? message.channelId === activeChannel.id : activeThread ? message.dmThreadId === activeThread.id : false)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    const canPost = activeChannel
        ? canPostInChannel(activeChannel, rules, currentProfile, viewerGroupSlugs)
        : Boolean(activeThread && currentProfile)

    const liveActionsEnabled = connection.isActive && Boolean(currentProfile)

    async function handleStartDm(targetClerkId: string) {
        if (!currentProfile || !liveActionsEnabled) {
            return
        }
        await createDmThread({
            actorClerkId: currentProfile.clerkId,
            otherClerkId: targetClerkId,
        })
    }

    async function handleSendMessage() {
        if (!currentProfile || !draftMessage.trim() || !liveActionsEnabled || !activeTarget) {
            return
        }

        await sendMessage({
            actorClerkId: currentProfile.clerkId,
            channelId: activeTarget.type === "channel" ? BigInt(activeTarget.id) : 0n,
            dmThreadId: activeTarget.type === "dm" ? BigInt(activeTarget.id) : 0n,
            body: draftMessage.trim(),
        })
        setDraftMessage("")
    }

    return (
        <div className="grid gap-6 xl:grid-cols-[270px_minmax(0,1fr)_300px]">
            <Card className="min-h-[720px]">
                <CardHeader>
                    <CardTitle>Groups and DMs</CardTitle>
                    <CardDescription>
                        Channel visibility is filtered by role and group membership, with read-only channels modeled like Discord announcements.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {groupedChannels.map(({ category, channels }) => (
                        <div key={category.id} className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{category.name}</p>
                            <div className="space-y-1">
                                {channels.map(channel => (
                                    <button
                                        key={channel.id}
                                        type="button"
                                        onClick={() => setActiveTarget({ type: "channel", id: channel.id })}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${activeTarget?.type === "channel" && activeTarget.id === channel.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {channel.kind === "announcement" ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                                            {channel.name}
                                        </span>
                                        {channel.kind === "announcement" ? <Badge variant="secondary">Read-only</Badge> : null}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Direct messages</p>
                        <div className="space-y-1">
                            {visibleThreads.length ? visibleThreads.map(thread => {
                                const otherProfile = profiles.find(profile => profile.clerkId === getOtherParticipant(thread, currentProfile?.clerkId ?? ""))
                                const unread = participants.find(participant => participant.threadId === thread.id && participant.clerkId === currentProfile?.clerkId)?.unreadCount ?? 0
                                return (
                                    <button
                                        key={thread.id}
                                        type="button"
                                        onClick={() => setActiveTarget({ type: "dm", id: thread.id })}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${activeTarget?.type === "dm" && activeTarget.id === thread.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <MessageCircleMore className="h-4 w-4" />
                                            {otherProfile?.displayName ?? "New thread"}
                                        </span>
                                        {unread > 0 ? <Badge>{unread}</Badge> : null}
                                    </button>
                                )
                            }) : (
                                <p className="rounded-xl border border-dashed px-3 py-4 text-sm text-muted-foreground">
                                    Start a DM from the member list on the right.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="min-h-[720px]">
                <CardHeader className="border-b">
                    <div className="flex flex-wrap items-center gap-3">
                        <CardTitle>
                            {activeChannel ? `# ${activeChannel.name}` : activeThread ? profiles.find(profile => profile.clerkId === getOtherParticipant(activeThread, currentProfile?.clerkId ?? ""))?.displayName ?? "Direct message" : "Select a conversation"}
                        </CardTitle>
                        {activeChannel?.kind === "announcement" ? <Badge>Announcement</Badge> : null}
                        {activeChannel && !canPost ? <Badge variant="outline">Read-only for you</Badge> : null}
                    </div>
                    <CardDescription>
                        {activeChannel?.description ?? (activeThread ? "Only thread participants can see this DM." : "Choose a channel or DM to begin.")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex h-[calc(100%-96px)] flex-col p-0">
                    <div className="flex-1 space-y-4 overflow-y-auto p-6">
                        {activeMessages.length ? activeMessages.map(message => {
                            const author = profiles.find(profile => profile.clerkId === message.authorClerkId)
                            return (
                                <div key={message.id} className="rounded-2xl border bg-background/70 p-4">
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{author?.displayName ?? "MakerSpace Member"}</p>
                                            <Badge variant="outline">{author?.role ?? "member"}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</p>
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground/90">{message.body}</p>
                                </div>
                            )
                        }) : (
                            <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
                                No messages yet. Start the conversation when live reducers are connected.
                            </div>
                        )}
                    </div>

                    <div className="border-t p-4">
                        {!canPost && activeChannel ? (
                            <div className="rounded-2xl border border-dashed bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                                You can view this channel, but only approved roles or groups can post here.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Textarea
                                    value={draftMessage}
                                    onChange={event => setDraftMessage(event.target.value)}
                                    placeholder={liveActionsEnabled ? "Type a message" : "Live posting unlocks when SpacetimeDB is connected"}
                                    rows={4}
                                    disabled={!liveActionsEnabled || !activeTarget}
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        {liveActionsEnabled
                                            ? "Text and links are supported in this first pass."
                                            : "Demo content is visible now. Configure your live backend to enable posting and DMs."}
                                    </p>
                                    <Button onClick={() => void handleSendMessage()} disabled={!liveActionsEnabled || !draftMessage.trim() || !activeTarget}>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="min-h-[720px]">
                <CardHeader>
                    <CardTitle>Permissions and people</CardTitle>
                    <CardDescription>
                        This pane surfaces which members can reach the current space and gives you a lightweight way to start DMs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {activeChannel ? (
                        <div className="space-y-3 rounded-2xl border bg-background/70 p-4">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                <p className="font-semibold">Channel rules</p>
                            </div>
                            {rules.filter(rule => rule.channelId === activeChannel.id).map(rule => (
                                <div key={rule.id} className="rounded-xl border px-3 py-2 text-sm">
                                    <p className="font-medium">{rule.subjectType}: {rule.subjectId}</p>
                                    <p className="text-muted-foreground">View: {rule.canView ? "yes" : "no"} • Post: {rule.canPost ? "yes" : "no"}</p>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <div className="space-y-3">
                        <p className="text-sm font-semibold">Member directory</p>
                        <div className="space-y-2">
                            {profiles
                                .filter(profile => profile.clerkId !== currentProfile?.clerkId)
                                .map(profile => (
                                    <div key={profile.clerkId} className="flex items-center justify-between rounded-xl border px-3 py-3">
                                        <div>
                                            <p className="font-medium">{profile.displayName}</p>
                                            <p className="text-xs text-muted-foreground">{profile.role}</p>
                                        </div>
                                        <Button variant="outline" size="sm" disabled={!liveActionsEnabled} onClick={() => void handleStartDm(profile.clerkId)}>
                                            DM
                                        </Button>
                                    </div>
                                ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
