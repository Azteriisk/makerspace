/* eslint-disable @typescript-eslint/no-explicit-any */
import { schema, table, t } from "spacetimedb/server"
import { ADMIN_CLERK_ID } from "./admin"

const app = schema({
    member_profile: table(
        { name: "member_profile", public: true },
        {
            clerk_id: t.string().primaryKey(),
            email: t.string(),
            display_name: t.string(),
            avatar_url: t.string(),
            role: t.string(),
            subscription_tier: t.string(),
            status: t.string(),
            created_at: t.timestamp(),
        }
    ),
    member_group: table(
        { name: "member_group", public: true },
        {
            id: t.u64().primaryKey().autoInc(),
            slug: t.string(),
            name: t.string(),
            description: t.string(),
        }
    ),
    member_group_membership: table(
        { name: "member_group_membership", public: true },
        {
            id: t.u64().primaryKey().autoInc(),
            clerk_id: t.string(),
            group_id: t.u64(),
        }
    ),
    channel_category: table(
        { name: "channel_category", public: true },
        {
            id: t.u64().primaryKey().autoInc(),
            slug: t.string(),
            name: t.string(),
            description: t.string(),
            sort_order: t.u32(),
        }
    ),
    channel: table(
        { name: "channel", public: true },
        {
            id: t.u64().primaryKey().autoInc(),
            category_id: t.u64(),
            slug: t.string(),
            name: t.string(),
            description: t.string(),
            kind: t.string(),
            is_archived: t.bool(),
            sort_order: t.u32(),
        }
    ),
    channel_access_rule: table(
        { name: "channel_access_rule", public: true },
        {
            id: t.u64().primaryKey().autoInc(),
            channel_id: t.u64(),
            subject_type: t.string(),
            subject_id: t.string(),
            can_view: t.bool(),
            can_post: t.bool(),
        }
    ),
    dm_thread: table(
        { name: "dm_thread", public: true },
        {
            id: t.u64().primaryKey().autoInc(),
            user_a_clerk_id: t.string(),
            user_b_clerk_id: t.string(),
            created_at: t.timestamp(),
        }
    ),
    dm_participant: table(
        { name: "dm_participant", public: true },
        {
            id: t.u64().primaryKey().autoInc(),
            thread_id: t.u64(),
            clerk_id: t.string(),
            unread_count: t.u32(),
        }
    ),
    message: table(
        { name: "message", public: true },
        {
            id: t.u64().primaryKey().autoInc(),
            channel_id: t.u64(),
            dm_thread_id: t.u64(),
            author_clerk_id: t.string(),
            body: t.string(),
            created_at: t.timestamp(),
            updated_at: t.timestamp(),
            is_deleted: t.bool(),
        }
    ),
    tutorial: table(
        { name: "tutorial", public: true },
        {
            id: t.u64().primaryKey().autoInc(),
            slug: t.string(),
            title: t.string(),
            summary: t.string(),
            kind: t.string(),
            difficulty: t.string(),
            thumbnail_url: t.string(),
            embed_url: t.string(),
            markdown_body: t.string(),
            published: t.bool(),
            featured: t.bool(),
            created_at: t.timestamp(),
            updated_at: t.timestamp(),
        }
    ),
    tutorial_tag: table(
        { name: "tutorial_tag", public: true },
        {
            id: t.u64().primaryKey().autoInc(),
            tutorial_id: t.u64(),
            tag: t.string(),
        }
    ),
})

export default app

type InitCtx = any
type ReducerCtx = any

function canonicalPair(a: string, b: string) {
    return [a, b].sort()
}

function roleRank(role: string) {
    switch (role) {
        case "owner":
            return 4
        case "admin":
            return 3
        case "moderator":
            return 2
        default:
            return 1
    }
}

function isPrivilegedRole(role: string) {
    return role === "owner" || role === "admin"
}

function ensureGroup(ctx: InitCtx | ReducerCtx, slug: string, name: string, description: string) {
    for (const group of ctx.db.member_group.iter()) {
        if (group.slug === slug) {
            return group
        }
    }

    return ctx.db.member_group.insert({
        id: 0n,
        slug,
        name,
        description,
    })
}

function ensureMembership(ctx: ReducerCtx, clerkId: string, groupId: bigint) {
    for (const membership of ctx.db.member_group_membership.iter()) {
        if (membership.clerk_id === clerkId && membership.group_id === groupId) {
            return
        }
    }

    ctx.db.member_group_membership.insert({
        id: 0n,
        clerk_id: clerkId,
        group_id: groupId,
    })
}

function requireProfile(ctx: ReducerCtx, clerkId: string) {
    const profile = ctx.db.member_profile.clerk_id.find(clerkId)
    if (!profile) {
        throw new Error("Member profile not found. Sync your profile first.")
    }
    return profile
}

function requireRole(ctx: ReducerCtx, clerkId: string, minimumRole: string) {
    const profile = requireProfile(ctx, clerkId)
    if (roleRank(profile.role) < roleRank(minimumRole)) {
        throw new Error("Unauthorized")
    }
    return profile
}

function getGroupSlugsForMember(ctx: ReducerCtx, clerkId: string) {
    const groupIds = new Set<bigint>()

    for (const membership of ctx.db.member_group_membership.iter()) {
        if (membership.clerk_id === clerkId) {
            groupIds.add(membership.group_id)
        }
    }

    const slugs = new Set<string>()

    for (const group of ctx.db.member_group.iter()) {
        if (groupIds.has(group.id)) {
            slugs.add(group.slug)
        }
    }

    return slugs
}

function hasChannelAccess(ctx: ReducerCtx, channelId: bigint, clerkId: string, permission: "view" | "post") {
    const profile = requireProfile(ctx, clerkId)
    if (isPrivilegedRole(profile.role)) {
        return true
    }

    const channelRules = []
    for (const rule of ctx.db.channel_access_rule.iter()) {
        if (rule.channel_id === channelId) {
            channelRules.push(rule)
        }
    }
    if (channelRules.length === 0) {
        return true
    }

    const viewerGroupSlugs = getGroupSlugsForMember(ctx, clerkId)

    return channelRules.some(rule => {
        const allowed = permission === "view" ? rule.can_view : rule.can_post
        if (!allowed) {
            return false
        }
        if (rule.subject_type === "everyone") {
            return true
        }
        if (rule.subject_type === "user") {
            return rule.subject_id === clerkId
        }
        if (rule.subject_type === "role") {
            return rule.subject_id === profile.role
        }
        if (rule.subject_type === "group") {
            return viewerGroupSlugs.has(rule.subject_id)
        }
        return false
    })
}

function findCategoryBySlug(ctx: InitCtx | ReducerCtx, slug: string) {
    for (const category of ctx.db.channel_category.iter()) {
        if (category.slug === slug) {
            return category
        }
    }
    return null
}

function findChannelBySlug(ctx: InitCtx | ReducerCtx, slug: string) {
    for (const channel of ctx.db.channel.iter()) {
        if (channel.slug === slug) {
            return channel
        }
    }
    return null
}

function seedAccessRule(ctx: InitCtx, channelId: bigint, subjectType: string, subjectId: string, canView: boolean, canPost: boolean) {
    ctx.db.channel_access_rule.insert({
        id: 0n,
        channel_id: channelId,
        subject_type: subjectType,
        subject_id: subjectId,
        can_view: canView,
        can_post: canPost,
    })
}

function seedMessage(ctx: InitCtx, args: { channelId?: bigint, dmThreadId?: bigint, authorClerkId: string, body: string }) {
    ctx.db.message.insert({
        id: 0n,
        channel_id: args.channelId ?? 0n,
        dm_thread_id: args.dmThreadId ?? 0n,
        author_clerk_id: args.authorClerkId,
        body: args.body,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
        is_deleted: false,
    })
}

export const init = app.init(ctx => {
    const allMembers = ensureGroup(ctx, "all-members", "All Members", "Every signed-in member")
    const staff = ensureGroup(ctx, "staff", "Staff", "Internal team coordination")
    ensureGroup(ctx, "robotics-cohort", "Robotics Cohort", "Robotics bootcamp members")
    ensureGroup(ctx, "vip-beta", "VIP Beta", "Early access members")

    const announcements = ctx.db.channel_category.insert({
        id: 0n,
        slug: "announcements",
        name: "Announcements",
        description: "Read-only updates from MakerSpace",
        sort_order: 1,
    })
    const learning = ctx.db.channel_category.insert({
        id: 0n,
        slug: "learning",
        name: "Learning",
        description: "Class discussion and how-to questions",
        sort_order: 2,
    })
    const community = ctx.db.channel_category.insert({
        id: 0n,
        slug: "community",
        name: "Community",
        description: "General chat and project groups",
        sort_order: 3,
    })
    const ops = ctx.db.channel_category.insert({
        id: 0n,
        slug: "ops",
        name: "Operations",
        description: "Staff-only coordination",
        sort_order: 4,
    })

    const welcome = ctx.db.channel.insert({
        id: 0n,
        category_id: announcements.id,
        slug: "welcome",
        name: "welcome",
        description: "Public updates and onboarding info",
        kind: "announcement",
        is_archived: false,
        sort_order: 1,
    })
    const classes = ctx.db.channel.insert({
        id: 0n,
        category_id: learning.id,
        slug: "class-help",
        name: "class-help",
        description: "Ask questions about workshops and guides",
        kind: "text",
        is_archived: false,
        sort_order: 1,
    })
    const projects = ctx.db.channel.insert({
        id: 0n,
        category_id: community.id,
        slug: "project-showcase",
        name: "project-showcase",
        description: "Share what you are building",
        kind: "text",
        is_archived: false,
        sort_order: 1,
    })
    const robots = ctx.db.channel.insert({
        id: 0n,
        category_id: community.id,
        slug: "robotics-cohort",
        name: "robotics-cohort",
        description: "Private cohort collaboration",
        kind: "text",
        is_archived: false,
        sort_order: 2,
    })
    const staffRoom = ctx.db.channel.insert({
        id: 0n,
        category_id: ops.id,
        slug: "staff-room",
        name: "staff-room",
        description: "Internal moderators and staff",
        kind: "text",
        is_archived: false,
        sort_order: 1,
    })

    seedAccessRule(ctx, welcome.id, "everyone", "everyone", true, false)
    seedAccessRule(ctx, classes.id, "group", allMembers.slug, true, true)
    seedAccessRule(ctx, projects.id, "group", allMembers.slug, true, true)
    seedAccessRule(ctx, robots.id, "group", "robotics-cohort", true, true)
    seedAccessRule(ctx, staffRoom.id, "group", staff.slug, true, true)

    ctx.db.member_profile.insert({
        clerk_id: "seed_owner",
        email: "owner@makerspace.local",
        display_name: "MakerSpace Owner",
        avatar_url: "",
        role: "owner",
        subscription_tier: "staff",
        status: "active",
        created_at: ctx.timestamp,
    })
    ctx.db.member_profile.insert({
        clerk_id: "seed_moderator",
        email: "moderator@makerspace.local",
        display_name: "Workshop Moderator",
        avatar_url: "",
        role: "moderator",
        subscription_tier: "staff",
        status: "active",
        created_at: ctx.timestamp,
    })
    ctx.db.member_profile.insert({
        clerk_id: "seed_member",
        email: "member@makerspace.local",
        display_name: "Community Member",
        avatar_url: "",
        role: "member",
        subscription_tier: "free",
        status: "active",
        created_at: ctx.timestamp,
    })

    ctx.db.member_group_membership.insert({ id: 0n, clerk_id: "seed_owner", group_id: allMembers.id })
    ctx.db.member_group_membership.insert({ id: 0n, clerk_id: "seed_owner", group_id: staff.id })
    ctx.db.member_group_membership.insert({ id: 0n, clerk_id: "seed_moderator", group_id: allMembers.id })
    ctx.db.member_group_membership.insert({ id: 0n, clerk_id: "seed_moderator", group_id: staff.id })
    ctx.db.member_group_membership.insert({ id: 0n, clerk_id: "seed_member", group_id: allMembers.id })

    const onboardingDm = ctx.db.dm_thread.insert({
        id: 0n,
        user_a_clerk_id: "seed_owner",
        user_b_clerk_id: "seed_member",
        created_at: ctx.timestamp,
    })

    ctx.db.dm_participant.insert({ id: 0n, thread_id: onboardingDm.id, clerk_id: "seed_owner", unread_count: 0 })
    ctx.db.dm_participant.insert({ id: 0n, thread_id: onboardingDm.id, clerk_id: "seed_member", unread_count: 1 })

    seedMessage(ctx, {
        channelId: welcome.id,
        authorClerkId: "seed_owner",
        body: "Welcome to MakerSpace. This channel is public to read, but only staff can post updates here.",
    })
    seedMessage(ctx, {
        channelId: classes.id,
        authorClerkId: "seed_moderator",
        body: "Drop workshop questions here and link the guide you are working through.",
    })
    seedMessage(ctx, {
        channelId: projects.id,
        authorClerkId: "seed_member",
        body: "I just finished a Raspberry Pi weather display. Posting photos next.",
    })
    seedMessage(ctx, {
        dmThreadId: onboardingDm.id,
        authorClerkId: "seed_owner",
        body: "Thanks for joining. DM me if you need help getting into the right project channels.",
    })

    const introGuide = ctx.db.tutorial.insert({
        id: 0n,
        slug: "arduino-first-blink",
        title: "Arduino First Blink",
        summary: "A starter walkthrough for wiring an LED and understanding the sketch lifecycle.",
        kind: "hybrid",
        difficulty: "Beginner",
        thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        embed_url: "https://www.youtube.com/embed/fJWR7dBuc18",
        markdown_body: "# Arduino First Blink\n\nFollow this guide to wire an LED, upload your first sketch, and understand what `setup()` and `loop()` do.\n\n## What you need\n\n- Arduino board\n- USB cable\n- LED and resistor\n\n## Steps\n\n1. Connect the LED to pin 13.\n2. Install Arduino IDE.\n3. Upload the Blink example.\n4. Change the delay values and observe the result.",
        published: true,
        featured: true,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
    })
    const printerGuide = ctx.db.tutorial.insert({
        id: 0n,
        slug: "fdm-failure-guide",
        title: "Common FDM Print Failures",
        summary: "A written troubleshooting guide for adhesion, layer shifts, and stringing.",
        kind: "article",
        difficulty: "Intermediate",
        thumbnail_url: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80",
        embed_url: "",
        markdown_body: "# Common FDM Print Failures\n\nUse this troubleshooting checklist when a print starts drifting, warping, or stringing.\n\n## Quick checks\n\n- Re-level the bed\n- Dry the filament\n- Slow the first layer\n- Inspect belt tension",
        published: true,
        featured: false,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
    })
    ctx.db.tutorial.insert({
        id: 0n,
        slug: "private-kicad-workflow",
        title: "KiCad Team Workflow",
        summary: "Staff draft for the upcoming advanced PCB curriculum.",
        kind: "video",
        difficulty: "Advanced",
        thumbnail_url: "",
        embed_url: "https://player.vimeo.com/video/76979871",
        markdown_body: "# KiCad Team Workflow\n\nDraft content only.",
        published: false,
        featured: false,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
    })

    ctx.db.tutorial_tag.insert({ id: 0n, tutorial_id: introGuide.id, tag: "arduino" })
    ctx.db.tutorial_tag.insert({ id: 0n, tutorial_id: introGuide.id, tag: "electronics" })
    ctx.db.tutorial_tag.insert({ id: 0n, tutorial_id: printerGuide.id, tag: "3d-printing" })
    ctx.db.tutorial_tag.insert({ id: 0n, tutorial_id: printerGuide.id, tag: "troubleshooting" })
})

export const syncProfileFromAuth = app.reducer(
    {
        clerk_id: t.string(),
        email: t.string(),
        display_name: t.string(),
        avatar_url: t.string(),
    },
    (ctx, { clerk_id, email, display_name, avatar_url }) => {
        if (!clerk_id) {
            throw new Error("clerk_id required")
        }

        const allMembers = ensureGroup(ctx, "all-members", "All Members", "Every signed-in member")
        const staff = ensureGroup(ctx, "staff", "Staff", "Internal team coordination")
        const existing = ctx.db.member_profile.clerk_id.find(clerk_id)
        const role = clerk_id === ADMIN_CLERK_ID && ADMIN_CLERK_ID ? "owner" : existing?.role ?? "member"
        const subscriptionTier = role === "member" ? existing?.subscription_tier ?? "free" : "staff"

        if (existing) {
            ctx.db.member_profile.clerk_id.update({
                ...existing,
                email,
                display_name,
                avatar_url,
                role,
                subscription_tier: subscriptionTier,
                status: "active",
            })
        } else {
            ctx.db.member_profile.insert({
                clerk_id,
                email,
                display_name,
                avatar_url,
                role,
                subscription_tier: subscriptionTier,
                status: "active",
                created_at: ctx.timestamp,
            })
        }

        ensureMembership(ctx, clerk_id, allMembers.id)
        if (role !== "member") {
            ensureMembership(ctx, clerk_id, staff.id)
        }
    }
)

export const createMemberGroup = app.reducer(
    {
        actor_clerk_id: t.string(),
        slug: t.string(),
        name: t.string(),
        description: t.string(),
    },
    (ctx, args) => {
        requireRole(ctx, args.actor_clerk_id, "admin")
        ensureGroup(ctx, args.slug, args.name, args.description)
    }
)

export const assignGroupMember = app.reducer(
    {
        actor_clerk_id: t.string(),
        target_clerk_id: t.string(),
        group_slug: t.string(),
    },
    (ctx, args) => {
        requireRole(ctx, args.actor_clerk_id, "admin")
        const targetGroup = ensureGroup(ctx, args.group_slug, args.group_slug, "")
        ensureMembership(ctx, args.target_clerk_id, targetGroup.id)
    }
)

export const createChannel = app.reducer(
    {
        actor_clerk_id: t.string(),
        category_slug: t.string(),
        slug: t.string(),
        name: t.string(),
        description: t.string(),
        kind: t.string(),
        sort_order: t.u32(),
    },
    (ctx, args) => {
        requireRole(ctx, args.actor_clerk_id, "admin")
        const category = findCategoryBySlug(ctx, args.category_slug)
        if (!category) {
            throw new Error("Category not found")
        }
        if (findChannelBySlug(ctx, args.slug)) {
            throw new Error("Channel slug already exists")
        }

        ctx.db.channel.insert({
            id: 0n,
            category_id: category.id,
            slug: args.slug,
            name: args.name,
            description: args.description,
            kind: args.kind,
            is_archived: false,
            sort_order: args.sort_order,
        })
    }
)

export const updateChannel = app.reducer(
    {
        actor_clerk_id: t.string(),
        channel_id: t.u64(),
        name: t.string(),
        description: t.string(),
        kind: t.string(),
        sort_order: t.u32(),
    },
    (ctx, args) => {
        requireRole(ctx, args.actor_clerk_id, "admin")
        const channel = ctx.db.channel.id.find(args.channel_id)
        if (!channel) {
            throw new Error("Channel not found")
        }
        ctx.db.channel.id.update({
            ...channel,
            name: args.name,
            description: args.description,
            kind: args.kind,
            sort_order: args.sort_order,
        })
    }
)

export const archiveChannel = app.reducer(
    {
        actor_clerk_id: t.string(),
        channel_id: t.u64(),
    },
    (ctx, args) => {
        requireRole(ctx, args.actor_clerk_id, "admin")
        const channel = ctx.db.channel.id.find(args.channel_id)
        if (!channel) {
            throw new Error("Channel not found")
        }
        ctx.db.channel.id.update({
            ...channel,
            is_archived: true,
        })
    }
)

export const setChannelAccessRule = app.reducer(
    {
        actor_clerk_id: t.string(),
        channel_id: t.u64(),
        subject_type: t.string(),
        subject_id: t.string(),
        can_view: t.bool(),
        can_post: t.bool(),
    },
    (ctx, args) => {
        requireRole(ctx, args.actor_clerk_id, "admin")
        ctx.db.channel_access_rule.insert({
            id: 0n,
            channel_id: args.channel_id,
            subject_type: args.subject_type,
            subject_id: args.subject_id,
            can_view: args.can_view,
            can_post: args.can_post,
        })
    }
)

export const createDmThread = app.reducer(
    {
        actor_clerk_id: t.string(),
        other_clerk_id: t.string(),
    },
    (ctx, args) => {
        if (!args.actor_clerk_id || !args.other_clerk_id || args.actor_clerk_id === args.other_clerk_id) {
            throw new Error("Two unique participants are required")
        }

        const [userA, userB] = canonicalPair(args.actor_clerk_id, args.other_clerk_id)
        for (const thread of ctx.db.dm_thread.iter()) {
            const [threadA, threadB] = canonicalPair(thread.user_a_clerk_id, thread.user_b_clerk_id)
            if (threadA === userA && threadB === userB) {
                return
            }
        }

        const thread = ctx.db.dm_thread.insert({
            id: 0n,
            user_a_clerk_id: userA,
            user_b_clerk_id: userB,
            created_at: ctx.timestamp,
        })

        ctx.db.dm_participant.insert({ id: 0n, thread_id: thread.id, clerk_id: userA, unread_count: 0 })
        ctx.db.dm_participant.insert({ id: 0n, thread_id: thread.id, clerk_id: userB, unread_count: 0 })
    }
)

export const sendMessage = app.reducer(
    {
        actor_clerk_id: t.string(),
        channel_id: t.u64(),
        dm_thread_id: t.u64(),
        body: t.string(),
    },
    (ctx, args) => {
        if (!args.body.trim()) {
            throw new Error("Message body is required")
        }

        requireProfile(ctx, args.actor_clerk_id)

        if (args.channel_id === 0n && args.dm_thread_id === 0n) {
            throw new Error("Message target is required")
        }

        if (args.channel_id !== 0n) {
            const channel = ctx.db.channel.id.find(args.channel_id)
            if (!channel || channel.is_archived) {
                throw new Error("Channel not found")
            }
            if (!hasChannelAccess(ctx, channel.id, args.actor_clerk_id, "post")) {
                throw new Error("Unauthorized")
            }
        }

        if (args.dm_thread_id !== 0n) {
            const thread = ctx.db.dm_thread.id.find(args.dm_thread_id)
            if (!thread) {
                throw new Error("DM thread not found")
            }
            if (thread.user_a_clerk_id !== args.actor_clerk_id && thread.user_b_clerk_id !== args.actor_clerk_id) {
                throw new Error("Unauthorized")
            }
        }

        ctx.db.message.insert({
            id: 0n,
            channel_id: args.channel_id,
            dm_thread_id: args.dm_thread_id,
            author_clerk_id: args.actor_clerk_id,
            body: args.body.trim(),
            created_at: ctx.timestamp,
            updated_at: ctx.timestamp,
            is_deleted: false,
        })
    }
)

export const editOwnMessage = app.reducer(
    {
        actor_clerk_id: t.string(),
        message_id: t.u64(),
        body: t.string(),
    },
    (ctx, args) => {
        const message = ctx.db.message.id.find(args.message_id)
        if (!message) {
            throw new Error("Message not found")
        }
        if (message.author_clerk_id !== args.actor_clerk_id) {
            throw new Error("Unauthorized")
        }
        ctx.db.message.id.update({
            ...message,
            body: args.body.trim(),
            updated_at: ctx.timestamp,
        })
    }
)

export const deleteMessage = app.reducer(
    {
        actor_clerk_id: t.string(),
        message_id: t.u64(),
    },
    (ctx, args) => {
        const actor = requireProfile(ctx, args.actor_clerk_id)
        const message = ctx.db.message.id.find(args.message_id)
        if (!message) {
            throw new Error("Message not found")
        }
        if (message.author_clerk_id !== args.actor_clerk_id && roleRank(actor.role) < roleRank("moderator")) {
            throw new Error("Unauthorized")
        }
        ctx.db.message.id.update({
            ...message,
            body: "[message deleted]",
            updated_at: ctx.timestamp,
            is_deleted: true,
        })
    }
)

export const markThreadRead = app.reducer(
    {
        actor_clerk_id: t.string(),
        thread_id: t.u64(),
    },
    (ctx, args) => {
        for (const participant of ctx.db.dm_participant.iter()) {
            if (participant.thread_id === args.thread_id && participant.clerk_id === args.actor_clerk_id) {
                ctx.db.dm_participant.id.update({
                    ...participant,
                    unread_count: 0,
                })
            }
        }
    }
)

export const createTutorial = app.reducer(
    {
        actor_clerk_id: t.string(),
        slug: t.string(),
        title: t.string(),
        summary: t.string(),
        kind: t.string(),
        difficulty: t.string(),
        thumbnail_url: t.string(),
        embed_url: t.string(),
        markdown_body: t.string(),
        featured: t.bool(),
        tags_csv: t.string(),
    },
    (ctx, args) => {
        requireRole(ctx, args.actor_clerk_id, "admin")
        const tutorial = ctx.db.tutorial.insert({
            id: 0n,
            slug: args.slug,
            title: args.title,
            summary: args.summary,
            kind: args.kind,
            difficulty: args.difficulty,
            thumbnail_url: args.thumbnail_url,
            embed_url: args.embed_url,
            markdown_body: args.markdown_body,
            published: false,
            featured: args.featured,
            created_at: ctx.timestamp,
            updated_at: ctx.timestamp,
        })

        for (const tag of args.tags_csv.split(",").map(tag => tag.trim()).filter(Boolean)) {
            ctx.db.tutorial_tag.insert({
                id: 0n,
                tutorial_id: tutorial.id,
                tag,
            })
        }
    }
)

export const updateTutorial = app.reducer(
    {
        actor_clerk_id: t.string(),
        tutorial_id: t.u64(),
        title: t.string(),
        summary: t.string(),
        kind: t.string(),
        difficulty: t.string(),
        thumbnail_url: t.string(),
        embed_url: t.string(),
        markdown_body: t.string(),
        featured: t.bool(),
    },
    (ctx, args) => {
        requireRole(ctx, args.actor_clerk_id, "admin")
        const tutorial = ctx.db.tutorial.id.find(args.tutorial_id)
        if (!tutorial) {
            throw new Error("Tutorial not found")
        }
        ctx.db.tutorial.id.update({
            ...tutorial,
            title: args.title,
            summary: args.summary,
            kind: args.kind,
            difficulty: args.difficulty,
            thumbnail_url: args.thumbnail_url,
            embed_url: args.embed_url,
            markdown_body: args.markdown_body,
            featured: args.featured,
            updated_at: ctx.timestamp,
        })
    }
)

export const publishTutorial = app.reducer(
    {
        actor_clerk_id: t.string(),
        tutorial_id: t.u64(),
    },
    (ctx, args) => {
        requireRole(ctx, args.actor_clerk_id, "admin")
        const tutorial = ctx.db.tutorial.id.find(args.tutorial_id)
        if (!tutorial) {
            throw new Error("Tutorial not found")
        }
        ctx.db.tutorial.id.update({
            ...tutorial,
            published: true,
            updated_at: ctx.timestamp,
        })
    }
)

export const archiveTutorial = app.reducer(
    {
        actor_clerk_id: t.string(),
        tutorial_id: t.u64(),
    },
    (ctx, args) => {
        requireRole(ctx, args.actor_clerk_id, "admin")
        const tutorial = ctx.db.tutorial.id.find(args.tutorial_id)
        if (!tutorial) {
            throw new Error("Tutorial not found")
        }
        ctx.db.tutorial.id.update({
            ...tutorial,
            published: false,
            featured: false,
            updated_at: ctx.timestamp,
        })
    }
)
