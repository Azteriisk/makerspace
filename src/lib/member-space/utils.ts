import type {
    Channel,
    ChannelAccessRule,
    ChannelCategory,
    DmParticipant,
    DmThread,
    MemberGroup,
    MemberGroupMembership,
    MemberProfile,
    Message,
    MemberRole,
    SubscriptionTier,
    Tutorial,
} from "@/lib/member-space/types"

type TimestampLike = { toDate?: () => Date, toISOString?: () => string } | string | number | bigint | Date

function toId(value: bigint | number | string) {
    return String(value)
}

function toTimestampString(value: TimestampLike) {
    if (value instanceof Date) {
        return value.toISOString()
    }
    if (typeof value === "object" && value !== null) {
        if ("toISOString" in value && typeof value.toISOString === "function") {
            return value.toISOString()
        }
        if ("toDate" in value && typeof value.toDate === "function") {
            return value.toDate().toISOString()
        }
    }
    return String(value)
}

export function mapProfiles(rows: ReadonlyArray<{
    clerkId: string
    email: string
    displayName: string
    avatarUrl: string
    role: string
    subscriptionTier: string
    status: string
}>): MemberProfile[] {
    return rows.map(row => ({
        clerkId: row.clerkId,
        email: row.email,
        displayName: row.displayName,
        avatarUrl: row.avatarUrl,
        role: row.role as MemberRole,
        subscriptionTier: row.subscriptionTier as SubscriptionTier,
        status: row.status,
    }))
}

export function mapGroups(rows: ReadonlyArray<{ id: bigint | number | string, slug: string, name: string, description: string }>): MemberGroup[] {
    return rows.map(row => ({
        id: toId(row.id),
        slug: row.slug,
        name: row.name,
        description: row.description,
    }))
}

export function mapMemberships(rows: ReadonlyArray<{ id: bigint | number | string, clerkId: string, groupId: bigint | number | string }>): MemberGroupMembership[] {
    return rows.map(row => ({
        id: toId(row.id),
        clerkId: row.clerkId,
        groupId: toId(row.groupId),
    }))
}

export function mapCategories(rows: ReadonlyArray<{ id: bigint | number | string, slug: string, name: string, description: string, sortOrder: number }>): ChannelCategory[] {
    return rows.map(row => ({
        id: toId(row.id),
        slug: row.slug,
        name: row.name,
        description: row.description,
        sortOrder: row.sortOrder,
    }))
}

export function mapChannels(rows: ReadonlyArray<{ id: bigint | number | string, categoryId: bigint | number | string, slug: string, name: string, description: string, kind: string, isArchived: boolean, sortOrder: number }>): Channel[] {
    return rows.map(row => ({
        id: toId(row.id),
        categoryId: toId(row.categoryId),
        slug: row.slug,
        name: row.name,
        description: row.description,
        kind: row.kind as Channel["kind"],
        isArchived: row.isArchived,
        sortOrder: row.sortOrder,
    }))
}

export function mapRules(rows: ReadonlyArray<{ id: bigint | number | string, channelId: bigint | number | string, subjectType: string, subjectId: string, canView: boolean, canPost: boolean }>): ChannelAccessRule[] {
    return rows.map(row => ({
        id: toId(row.id),
        channelId: toId(row.channelId),
        subjectType: row.subjectType as ChannelAccessRule["subjectType"],
        subjectId: row.subjectId,
        canView: row.canView,
        canPost: row.canPost,
    }))
}

export function mapThreads(rows: ReadonlyArray<{ id: bigint | number | string, userAClerkId: string, userBClerkId: string, createdAt: TimestampLike }>): DmThread[] {
    return rows.map(row => ({
        id: toId(row.id),
        userAClerkId: row.userAClerkId,
        userBClerkId: row.userBClerkId,
        createdAt: toTimestampString(row.createdAt),
    }))
}

export function mapParticipants(rows: ReadonlyArray<{ id: bigint | number | string, threadId: bigint | number | string, clerkId: string, unreadCount: number }>): DmParticipant[] {
    return rows.map(row => ({
        id: toId(row.id),
        threadId: toId(row.threadId),
        clerkId: row.clerkId,
        unreadCount: row.unreadCount,
    }))
}

export function mapMessages(rows: ReadonlyArray<{ id: bigint | number | string, channelId: bigint | number | string, dmThreadId: bigint | number | string, authorClerkId: string, body: string, createdAt: TimestampLike, updatedAt: TimestampLike, isDeleted: boolean }>): Message[] {
    return rows.map(row => ({
        id: toId(row.id),
        channelId: toId(row.channelId),
        dmThreadId: toId(row.dmThreadId),
        authorClerkId: row.authorClerkId,
        body: row.body,
        createdAt: toTimestampString(row.createdAt),
        updatedAt: toTimestampString(row.updatedAt),
        isDeleted: row.isDeleted,
    }))
}

export function mapTutorials(
    tutorialRows: ReadonlyArray<{ id: bigint | number | string, slug: string, title: string, summary: string, kind: string, difficulty: string, thumbnailUrl: string, embedUrl: string, markdownBody: string, published: boolean, featured: boolean, createdAt: TimestampLike, updatedAt: TimestampLike }>,
    tagRows: ReadonlyArray<{ tutorialId: bigint | number | string, tag: string }>
): Tutorial[] {
    return tutorialRows.map(row => ({
        id: toId(row.id),
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        kind: row.kind as Tutorial["kind"],
        difficulty: row.difficulty,
        thumbnailUrl: row.thumbnailUrl,
        embedUrl: row.embedUrl,
        markdownBody: row.markdownBody,
        published: row.published,
        featured: row.featured,
        createdAt: toTimestampString(row.createdAt),
        updatedAt: toTimestampString(row.updatedAt),
        tags: tagRows.filter(tag => toId(tag.tutorialId) === toId(row.id)).map(tag => tag.tag),
    }))
}

export function getCurrentProfile(profiles: MemberProfile[], userId: string | null, fallback?: Partial<MemberProfile>) {
    if (!userId) {
        return null
    }

    const existing = profiles.find(profile => profile.clerkId === userId)
    if (existing) {
        return existing
    }

    if (!fallback) {
        return null
    }

    return {
        clerkId: userId,
        email: fallback.email ?? "",
        displayName: fallback.displayName ?? "New Member",
        avatarUrl: fallback.avatarUrl ?? "",
        role: fallback.role ?? "member",
        subscriptionTier: fallback.subscriptionTier ?? "free",
        status: fallback.status ?? "active",
    } satisfies MemberProfile
}

export function getUserGroupSlugs(groups: MemberGroup[], memberships: MemberGroupMembership[], clerkId: string | null) {
    if (!clerkId) {
        return new Set<string>()
    }

    const groupIds = new Set(
        memberships.filter(membership => membership.clerkId === clerkId).map(membership => membership.groupId)
    )

    return new Set(
        groups.filter(group => groupIds.has(group.id)).map(group => group.slug)
    )
}

function isPrivilegedMember(viewer: MemberProfile | null) {
    return viewer?.role === "owner" || viewer?.role === "admin"
}

export function canViewChannel(channel: Channel, rules: ChannelAccessRule[], viewer: MemberProfile | null, viewerGroupSlugs: Set<string>) {
    if (isPrivilegedMember(viewer)) {
        return true
    }

    const channelRules = rules.filter(rule => rule.channelId === channel.id)
    if (channelRules.length === 0) {
        return true
    }

    return channelRules.some(rule => {
        if (!rule.canView) {
            return false
        }
        if (rule.subjectType === "everyone") {
            return true
        }
        if (!viewer) {
            return false
        }
        if (rule.subjectType === "user") {
            return rule.subjectId === viewer.clerkId
        }
        if (rule.subjectType === "role") {
            return rule.subjectId === viewer.role
        }
        if (rule.subjectType === "group") {
            return viewerGroupSlugs.has(rule.subjectId)
        }
        return false
    })
}

export function canPostInChannel(channel: Channel, rules: ChannelAccessRule[], viewer: MemberProfile | null, viewerGroupSlugs: Set<string>) {
    if (isPrivilegedMember(viewer)) {
        return true
    }

    const channelRules = rules.filter(rule => rule.channelId === channel.id)
    if (channelRules.length === 0) {
        return true
    }

    return channelRules.some(rule => {
        if (!rule.canPost) {
            return false
        }
        if (rule.subjectType === "everyone") {
            return true
        }
        if (!viewer) {
            return false
        }
        if (rule.subjectType === "user") {
            return rule.subjectId === viewer.clerkId
        }
        if (rule.subjectType === "role") {
            return rule.subjectId === viewer.role
        }
        if (rule.subjectType === "group") {
            return viewerGroupSlugs.has(rule.subjectId)
        }
        return false
    })
}

export function getOtherParticipant(thread: DmThread, currentUserId: string) {
    return thread.userAClerkId === currentUserId ? thread.userBClerkId : thread.userAClerkId
}
