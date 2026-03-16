export type MemberRole = "owner" | "admin" | "moderator" | "member"
export type SubscriptionTier = "free" | "paid" | "staff"
export type TutorialKind = "video" | "article" | "hybrid"
export type ChannelKind = "text" | "announcement" | "dm"
export type SubjectType = "everyone" | "role" | "group" | "user"

export interface MemberProfile {
    clerkId: string
    email: string
    displayName: string
    avatarUrl: string
    role: MemberRole
    subscriptionTier: SubscriptionTier
    status: string
}

export interface MemberGroup {
    id: string
    slug: string
    name: string
    description: string
}

export interface MemberGroupMembership {
    id: string
    clerkId: string
    groupId: string
}

export interface ChannelCategory {
    id: string
    slug: string
    name: string
    description: string
    sortOrder: number
}

export interface Channel {
    id: string
    categoryId: string
    slug: string
    name: string
    description: string
    kind: ChannelKind
    isArchived: boolean
    sortOrder: number
}

export interface ChannelAccessRule {
    id: string
    channelId: string
    subjectType: SubjectType
    subjectId: string
    canView: boolean
    canPost: boolean
}

export interface DmThread {
    id: string
    userAClerkId: string
    userBClerkId: string
    createdAt: string
}

export interface DmParticipant {
    id: string
    threadId: string
    clerkId: string
    unreadCount: number
}

export interface Message {
    id: string
    channelId: string
    dmThreadId: string
    authorClerkId: string
    body: string
    createdAt: string
    updatedAt: string
    isDeleted: boolean
}

export interface Tutorial {
    id: string
    slug: string
    title: string
    summary: string
    kind: TutorialKind
    difficulty: string
    thumbnailUrl: string
    embedUrl: string
    markdownBody: string
    published: boolean
    featured: boolean
    createdAt: string
    updatedAt: string
    tags: string[]
}
