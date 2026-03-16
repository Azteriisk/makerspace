"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"
import { useReducer, useSpacetimeDB, useTable } from "spacetimedb/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    demoAccessRules,
    demoCategories,
    demoChannels,
    demoGroups,
    demoMemberships,
    demoProfiles,
    demoTutorials,
} from "@/lib/member-space/demo-data"
import { getCurrentProfile, mapCategories, mapChannels, mapGroups, mapMemberships, mapProfiles, mapRules, mapTutorials } from "@/lib/member-space/utils"
import { reducers, tables } from "@/module_bindings"

const defaultChannelForm = {
    selectedId: "",
    categorySlug: "community",
    slug: "",
    name: "",
    description: "",
    kind: "text",
    sortOrder: "1",
}

const defaultTutorialForm = {
    selectedId: "",
    slug: "",
    title: "",
    summary: "",
    kind: "article",
    difficulty: "Beginner",
    thumbnailUrl: "",
    embedUrl: "",
    markdownBody: "",
    featured: false,
    tagsCsv: "",
}

export function AdminClient() {
    const { user } = useUser()
    const connection = useSpacetimeDB()
    const [profileRows] = useTable(tables.member_profile)
    const [groupRows] = useTable(tables.member_group)
    const [membershipRows] = useTable(tables.member_group_membership)
    const [categoryRows] = useTable(tables.channel_category)
    const [channelRows] = useTable(tables.channel)
    const [ruleRows] = useTable(tables.channel_access_rule)
    const [tutorialRows] = useTable(tables.tutorial)
    const [tutorialTagRows] = useTable(tables.tutorial_tag)

    const profiles = profileRows.length > 0 ? mapProfiles(profileRows) : demoProfiles
    const groups = groupRows.length > 0 ? mapGroups(groupRows) : demoGroups
    const memberships = membershipRows.length > 0 ? mapMemberships(membershipRows) : demoMemberships
    const categories = categoryRows.length > 0 ? mapCategories(categoryRows) : demoCategories
    const channels = channelRows.length > 0 ? mapChannels(channelRows) : demoChannels
    const rules = ruleRows.length > 0 ? mapRules(ruleRows) : demoAccessRules
    const tutorials = tutorialRows.length > 0 ? mapTutorials(tutorialRows, tutorialTagRows) : demoTutorials
    const currentProfile = getCurrentProfile(profiles, user?.id ?? null, {
        displayName: user?.fullName ?? user?.username ?? "MakerSpace Admin",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        avatarUrl: user?.imageUrl ?? "",
        role: "owner",
        subscriptionTier: "staff",
    })
    const liveActionsEnabled = connection.isActive && Boolean(currentProfile)

    const createGroup = useReducer(reducers.createMemberGroup)
    const assignGroupMember = useReducer(reducers.assignGroupMember)
    const createChannel = useReducer(reducers.createChannel)
    const updateChannel = useReducer(reducers.updateChannel)
    const archiveChannel = useReducer(reducers.archiveChannel)
    const setChannelAccessRule = useReducer(reducers.setChannelAccessRule)
    const createTutorial = useReducer(reducers.createTutorial)
    const updateTutorial = useReducer(reducers.updateTutorial)
    const publishTutorial = useReducer(reducers.publishTutorial)
    const archiveTutorial = useReducer(reducers.archiveTutorial)

    const [groupForm, setGroupForm] = React.useState({ slug: "", name: "", description: "" })
    const [membershipForm, setMembershipForm] = React.useState({ targetClerkId: "", groupSlug: "all-members" })
    const [channelForm, setChannelForm] = React.useState(defaultChannelForm)
    const [ruleForm, setRuleForm] = React.useState({ channelId: "", subjectType: "group", subjectId: "all-members", canView: true, canPost: true })
    const [tutorialForm, setTutorialForm] = React.useState(defaultTutorialForm)

    async function handleGroupSubmit() {
        if (!currentProfile || !groupForm.slug || !groupForm.name || !liveActionsEnabled) {
            return
        }

        await createGroup({
            actorClerkId: currentProfile.clerkId,
            slug: groupForm.slug,
            name: groupForm.name,
            description: groupForm.description,
        })
        setGroupForm({ slug: "", name: "", description: "" })
    }

    async function handleAssignMember() {
        if (!currentProfile || !membershipForm.targetClerkId || !membershipForm.groupSlug || !liveActionsEnabled) {
            return
        }

        await assignGroupMember({
            actorClerkId: currentProfile.clerkId,
            targetClerkId: membershipForm.targetClerkId,
            groupSlug: membershipForm.groupSlug,
        })
    }

    async function handleChannelSubmit() {
        if (!currentProfile || !channelForm.slug || !channelForm.name || !liveActionsEnabled) {
            return
        }

        if (channelForm.selectedId) {
            await updateChannel({
                actorClerkId: currentProfile.clerkId,
                channelId: BigInt(channelForm.selectedId),
                name: channelForm.name,
                description: channelForm.description,
                kind: channelForm.kind,
                sortOrder: Number(channelForm.sortOrder),
            })
        } else {
            await createChannel({
                actorClerkId: currentProfile.clerkId,
                categorySlug: channelForm.categorySlug,
                slug: channelForm.slug,
                name: channelForm.name,
                description: channelForm.description,
                kind: channelForm.kind,
                sortOrder: Number(channelForm.sortOrder),
            })
        }

        setChannelForm(defaultChannelForm)
    }

    async function handleRuleSubmit() {
        if (!currentProfile || !ruleForm.channelId || !ruleForm.subjectId || !liveActionsEnabled) {
            return
        }

        await setChannelAccessRule({
            actorClerkId: currentProfile.clerkId,
            channelId: BigInt(ruleForm.channelId),
            subjectType: ruleForm.subjectType,
            subjectId: ruleForm.subjectId,
            canView: ruleForm.canView,
            canPost: ruleForm.canPost,
        })
    }

    async function handleTutorialSubmit() {
        if (!currentProfile || !tutorialForm.slug || !tutorialForm.title || !liveActionsEnabled) {
            return
        }

        if (tutorialForm.selectedId) {
            await updateTutorial({
                actorClerkId: currentProfile.clerkId,
                tutorialId: BigInt(tutorialForm.selectedId),
                title: tutorialForm.title,
                summary: tutorialForm.summary,
                kind: tutorialForm.kind,
                difficulty: tutorialForm.difficulty,
                thumbnailUrl: tutorialForm.thumbnailUrl,
                embedUrl: tutorialForm.embedUrl,
                markdownBody: tutorialForm.markdownBody,
                featured: tutorialForm.featured,
            })
        } else {
            await createTutorial({
                actorClerkId: currentProfile.clerkId,
                slug: tutorialForm.slug,
                title: tutorialForm.title,
                summary: tutorialForm.summary,
                kind: tutorialForm.kind,
                difficulty: tutorialForm.difficulty,
                thumbnailUrl: tutorialForm.thumbnailUrl,
                embedUrl: tutorialForm.embedUrl,
                markdownBody: tutorialForm.markdownBody,
                featured: tutorialForm.featured,
                tagsCsv: tutorialForm.tagsCsv,
            })
        }

        setTutorialForm(defaultTutorialForm)
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
                <p className="text-sm text-muted-foreground">
                    Create channels and groups, assign member visibility, and publish tutorials from one control surface.
                </p>
            </div>

            {!liveActionsEnabled ? (
                <Card className="border-dashed border-primary/30 bg-primary/5">
                    <CardHeader>
                        <CardTitle>Live admin actions are waiting on SpacetimeDB</CardTitle>
                        <CardDescription>
                            The forms below are wired to the generated reducers, but they stay read-only until the realtime connection is fully configured.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Member groups</CardTitle>
                        <CardDescription>Create audience buckets and assign members into them.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="group-slug">Create group</Label>
                            <Input id="group-slug" placeholder="robotics-cohort" value={groupForm.slug} onChange={event => setGroupForm(current => ({ ...current, slug: event.target.value }))} />
                            <Input placeholder="Robotics Cohort" value={groupForm.name} onChange={event => setGroupForm(current => ({ ...current, name: event.target.value }))} />
                            <Textarea placeholder="Private robotics learners" value={groupForm.description} onChange={event => setGroupForm(current => ({ ...current, description: event.target.value }))} />
                            <Button onClick={() => void handleGroupSubmit()} disabled={!liveActionsEnabled}>Create group</Button>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="assign-member">Assign member to group</Label>
                            <select
                                id="assign-member"
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={membershipForm.targetClerkId}
                                onChange={event => setMembershipForm(current => ({ ...current, targetClerkId: event.target.value }))}
                            >
                                <option value="">Select member</option>
                                {profiles.map(profile => (
                                    <option key={profile.clerkId} value={profile.clerkId}>
                                        {profile.displayName} ({profile.role})
                                    </option>
                                ))}
                            </select>
                            <select
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={membershipForm.groupSlug}
                                onChange={event => setMembershipForm(current => ({ ...current, groupSlug: event.target.value }))}
                            >
                                {groups.map(group => (
                                    <option key={group.id} value={group.slug}>{group.name}</option>
                                ))}
                            </select>
                            <Button variant="outline" onClick={() => void handleAssignMember()} disabled={!liveActionsEnabled}>Assign member</Button>
                        </div>

                        <div className="space-y-2">
                            {groups.map(group => (
                                <div key={group.id} className="rounded-xl border px-3 py-3">
                                    <p className="font-medium">{group.name}</p>
                                    <p className="text-sm text-muted-foreground">{group.description}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {memberships
                                            .filter(membership => membership.groupId === group.id)
                                            .map(membership => profiles.find(profile => profile.clerkId === membership.clerkId)?.displayName ?? membership.clerkId)
                                            .map(name => (
                                                <Badge key={name} variant="secondary">{name}</Badge>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Channels and permissions</CardTitle>
                        <CardDescription>Create, edit, archive, and permission channels from the same panel.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Channel editor</Label>
                            <select
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={channelForm.categorySlug}
                                onChange={event => setChannelForm(current => ({ ...current, categorySlug: event.target.value }))}
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.slug}>{category.name}</option>
                                ))}
                            </select>
                            <Input placeholder="channel-slug" value={channelForm.slug} onChange={event => setChannelForm(current => ({ ...current, slug: event.target.value }))} />
                            <Input placeholder="Channel name" value={channelForm.name} onChange={event => setChannelForm(current => ({ ...current, name: event.target.value }))} />
                            <Textarea placeholder="What is this channel for?" value={channelForm.description} onChange={event => setChannelForm(current => ({ ...current, description: event.target.value }))} />
                            <div className="grid gap-3 md:grid-cols-2">
                                <select
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    value={channelForm.kind}
                                    onChange={event => setChannelForm(current => ({ ...current, kind: event.target.value }))}
                                >
                                    <option value="text">text</option>
                                    <option value="announcement">announcement</option>
                                </select>
                                <Input placeholder="Sort order" value={channelForm.sortOrder} onChange={event => setChannelForm(current => ({ ...current, sortOrder: event.target.value }))} />
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={() => void handleChannelSubmit()} disabled={!liveActionsEnabled}>
                                    {channelForm.selectedId ? "Save channel" : "Create channel"}
                                </Button>
                                {channelForm.selectedId ? (
                                    <Button variant="outline" onClick={() => setChannelForm(defaultChannelForm)}>Cancel edit</Button>
                                ) : null}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Access rule</Label>
                            <select
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={ruleForm.channelId}
                                onChange={event => setRuleForm(current => ({ ...current, channelId: event.target.value }))}
                            >
                                <option value="">Select channel</option>
                                {channels.map(channel => (
                                    <option key={channel.id} value={channel.id}>{channel.name}</option>
                                ))}
                            </select>
                            <div className="grid gap-3 md:grid-cols-2">
                                <select
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    value={ruleForm.subjectType}
                                    onChange={event => setRuleForm(current => ({ ...current, subjectType: event.target.value }))}
                                >
                                    <option value="everyone">everyone</option>
                                    <option value="group">group</option>
                                    <option value="role">role</option>
                                    <option value="user">user</option>
                                </select>
                                <Input placeholder="all-members / moderator / user_123" value={ruleForm.subjectId} onChange={event => setRuleForm(current => ({ ...current, subjectId: event.target.value }))} />
                            </div>
                            <div className="flex gap-6 text-sm">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={ruleForm.canView} onChange={event => setRuleForm(current => ({ ...current, canView: event.target.checked }))} />
                                    View
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={ruleForm.canPost} onChange={event => setRuleForm(current => ({ ...current, canPost: event.target.checked }))} />
                                    Post
                                </label>
                            </div>
                            <Button variant="outline" onClick={() => void handleRuleSubmit()} disabled={!liveActionsEnabled}>Add rule</Button>
                        </div>

                        <div className="space-y-2">
                            {channels.map(channel => (
                                <div key={channel.id} className="rounded-xl border px-3 py-3">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium">{channel.name}</p>
                                            <p className="text-sm text-muted-foreground">{channel.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setChannelForm({
                                                    selectedId: channel.id,
                                                    categorySlug: categories.find(category => category.id === channel.categoryId)?.slug ?? "community",
                                                    slug: channel.slug,
                                                    name: channel.name,
                                                    description: channel.description,
                                                    kind: channel.kind,
                                                    sortOrder: String(channel.sortOrder),
                                                })}
                                            >
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" disabled={!liveActionsEnabled} onClick={() => void archiveChannel({ actorClerkId: currentProfile?.clerkId ?? "", channelId: BigInt(channel.id) })}>
                                                Archive
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {rules.filter(rule => rule.channelId === channel.id).map(rule => (
                                            <Badge key={rule.id} variant="secondary">
                                                {rule.subjectType}:{rule.subjectId} • view {rule.canView ? "y" : "n"} • post {rule.canPost ? "y" : "n"}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>How-To content</CardTitle>
                    <CardDescription>Create draft guides, update them, and publish when ready.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-3">
                        <Input placeholder="tutorial-slug" value={tutorialForm.slug} onChange={event => setTutorialForm(current => ({ ...current, slug: event.target.value }))} />
                        <Input placeholder="Title" value={tutorialForm.title} onChange={event => setTutorialForm(current => ({ ...current, title: event.target.value }))} />
                        <Textarea placeholder="Short summary" value={tutorialForm.summary} onChange={event => setTutorialForm(current => ({ ...current, summary: event.target.value }))} />
                        <div className="grid gap-3 md:grid-cols-2">
                            <select
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={tutorialForm.kind}
                                onChange={event => setTutorialForm(current => ({ ...current, kind: event.target.value }))}
                            >
                                <option value="article">article</option>
                                <option value="video">video</option>
                                <option value="hybrid">hybrid</option>
                            </select>
                            <Input placeholder="Beginner / Intermediate / Advanced" value={tutorialForm.difficulty} onChange={event => setTutorialForm(current => ({ ...current, difficulty: event.target.value }))} />
                        </div>
                        <Input placeholder="Thumbnail URL" value={tutorialForm.thumbnailUrl} onChange={event => setTutorialForm(current => ({ ...current, thumbnailUrl: event.target.value }))} />
                        <Input placeholder="Embed URL" value={tutorialForm.embedUrl} onChange={event => setTutorialForm(current => ({ ...current, embedUrl: event.target.value }))} />
                        <Input placeholder="arduino, electronics" value={tutorialForm.tagsCsv} onChange={event => setTutorialForm(current => ({ ...current, tagsCsv: event.target.value }))} />
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={tutorialForm.featured} onChange={event => setTutorialForm(current => ({ ...current, featured: event.target.checked }))} />
                            Featured
                        </label>
                        <Textarea rows={12} placeholder="Markdown body" value={tutorialForm.markdownBody} onChange={event => setTutorialForm(current => ({ ...current, markdownBody: event.target.value }))} />
                        <div className="flex gap-3">
                            <Button onClick={() => void handleTutorialSubmit()} disabled={!liveActionsEnabled}>
                                {tutorialForm.selectedId ? "Save tutorial" : "Create tutorial"}
                            </Button>
                            {tutorialForm.selectedId ? (
                                <Button variant="outline" onClick={() => setTutorialForm(defaultTutorialForm)}>Cancel edit</Button>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {tutorials.map(tutorial => (
                            <div key={tutorial.id} className="rounded-2xl border px-4 py-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge>{tutorial.kind}</Badge>
                                            <Badge variant={tutorial.published ? "default" : "outline"}>{tutorial.published ? "Published" : "Draft"}</Badge>
                                            {tutorial.featured ? <Badge variant="secondary">Featured</Badge> : null}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{tutorial.title}</p>
                                            <p className="text-sm text-muted-foreground">{tutorial.summary}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {tutorial.tags.map(tag => (
                                                <Badge key={tag} variant="outline">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setTutorialForm({
                                                selectedId: tutorial.id,
                                                slug: tutorial.slug,
                                                title: tutorial.title,
                                                summary: tutorial.summary,
                                                kind: tutorial.kind,
                                                difficulty: tutorial.difficulty,
                                                thumbnailUrl: tutorial.thumbnailUrl,
                                                embedUrl: tutorial.embedUrl,
                                                markdownBody: tutorial.markdownBody,
                                                featured: tutorial.featured,
                                                tagsCsv: tutorial.tags.join(", "),
                                            })}
                                        >
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm" disabled={!liveActionsEnabled || tutorial.published} onClick={() => void publishTutorial({ actorClerkId: currentProfile?.clerkId ?? "", tutorialId: BigInt(tutorial.id) })}>
                                            Publish
                                        </Button>
                                        <Button variant="outline" size="sm" disabled={!liveActionsEnabled} onClick={() => void archiveTutorial({ actorClerkId: currentProfile?.clerkId ?? "", tutorialId: BigInt(tutorial.id) })}>
                                            Archive
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
