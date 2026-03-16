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
    Tutorial,
} from "@/lib/member-space/types"

export const demoProfiles: MemberProfile[] = [
    {
        clerkId: "seed_owner",
        email: "owner@makerspace.local",
        displayName: "MakerSpace Owner",
        avatarUrl: "",
        role: "owner",
        subscriptionTier: "staff",
        status: "active",
    },
    {
        clerkId: "seed_moderator",
        email: "moderator@makerspace.local",
        displayName: "Workshop Moderator",
        avatarUrl: "",
        role: "moderator",
        subscriptionTier: "staff",
        status: "active",
    },
    {
        clerkId: "seed_member",
        email: "member@makerspace.local",
        displayName: "Community Member",
        avatarUrl: "",
        role: "member",
        subscriptionTier: "free",
        status: "active",
    },
]

export const demoGroups: MemberGroup[] = [
    { id: "1", slug: "all-members", name: "All Members", description: "Every signed-in member" },
    { id: "2", slug: "staff", name: "Staff", description: "Internal team coordination" },
    { id: "3", slug: "robotics-cohort", name: "Robotics Cohort", description: "Private robotics learners" },
]

export const demoMemberships: MemberGroupMembership[] = [
    { id: "1", clerkId: "seed_owner", groupId: "1" },
    { id: "2", clerkId: "seed_owner", groupId: "2" },
    { id: "3", clerkId: "seed_moderator", groupId: "1" },
    { id: "4", clerkId: "seed_moderator", groupId: "2" },
    { id: "5", clerkId: "seed_member", groupId: "1" },
]

export const demoCategories: ChannelCategory[] = [
    { id: "1", slug: "announcements", name: "Announcements", description: "Read-only updates", sortOrder: 1 },
    { id: "2", slug: "learning", name: "Learning", description: "Classes and guides", sortOrder: 2 },
    { id: "3", slug: "community", name: "Community", description: "Projects and chat", sortOrder: 3 },
    { id: "4", slug: "ops", name: "Operations", description: "Staff coordination", sortOrder: 4 },
]

export const demoChannels: Channel[] = [
    { id: "1", categoryId: "1", slug: "welcome", name: "welcome", description: "Public onboarding updates", kind: "announcement", isArchived: false, sortOrder: 1 },
    { id: "2", categoryId: "2", slug: "class-help", name: "class-help", description: "Workshop questions and guide links", kind: "text", isArchived: false, sortOrder: 1 },
    { id: "3", categoryId: "3", slug: "project-showcase", name: "project-showcase", description: "Share your builds", kind: "text", isArchived: false, sortOrder: 1 },
    { id: "4", categoryId: "3", slug: "robotics-cohort", name: "robotics-cohort", description: "Private cohort collaboration", kind: "text", isArchived: false, sortOrder: 2 },
    { id: "5", categoryId: "4", slug: "staff-room", name: "staff-room", description: "Internal moderator and staff chat", kind: "text", isArchived: false, sortOrder: 1 },
]

export const demoAccessRules: ChannelAccessRule[] = [
    { id: "1", channelId: "1", subjectType: "everyone", subjectId: "everyone", canView: true, canPost: false },
    { id: "2", channelId: "2", subjectType: "group", subjectId: "all-members", canView: true, canPost: true },
    { id: "3", channelId: "3", subjectType: "group", subjectId: "all-members", canView: true, canPost: true },
    { id: "4", channelId: "4", subjectType: "group", subjectId: "robotics-cohort", canView: true, canPost: true },
    { id: "5", channelId: "5", subjectType: "group", subjectId: "staff", canView: true, canPost: true },
]

export const demoThreads: DmThread[] = [
    {
        id: "1",
        userAClerkId: "seed_owner",
        userBClerkId: "seed_member",
        createdAt: "2026-03-16T12:00:00.000Z",
    },
]

export const demoParticipants: DmParticipant[] = [
    { id: "1", threadId: "1", clerkId: "seed_owner", unreadCount: 0 },
    { id: "2", threadId: "1", clerkId: "seed_member", unreadCount: 1 },
]

export const demoMessages: Message[] = [
    {
        id: "1",
        channelId: "1",
        dmThreadId: "0",
        authorClerkId: "seed_owner",
        body: "Welcome to MakerSpace. This channel is public to read, but only staff can post updates here.",
        createdAt: "2026-03-16T12:00:00.000Z",
        updatedAt: "2026-03-16T12:00:00.000Z",
        isDeleted: false,
    },
    {
        id: "2",
        channelId: "2",
        dmThreadId: "0",
        authorClerkId: "seed_moderator",
        body: "Drop workshop questions here and link the guide you are working through.",
        createdAt: "2026-03-16T12:05:00.000Z",
        updatedAt: "2026-03-16T12:05:00.000Z",
        isDeleted: false,
    },
    {
        id: "3",
        channelId: "3",
        dmThreadId: "0",
        authorClerkId: "seed_member",
        body: "I just finished a Raspberry Pi weather display. Posting photos next.",
        createdAt: "2026-03-16T12:10:00.000Z",
        updatedAt: "2026-03-16T12:10:00.000Z",
        isDeleted: false,
    },
    {
        id: "4",
        channelId: "0",
        dmThreadId: "1",
        authorClerkId: "seed_owner",
        body: "Thanks for joining. DM me if you need help getting into the right project channels.",
        createdAt: "2026-03-16T12:15:00.000Z",
        updatedAt: "2026-03-16T12:15:00.000Z",
        isDeleted: false,
    },
]

export const demoTutorials: Tutorial[] = [
    {
        id: "1",
        slug: "arduino-first-blink",
        title: "Arduino First Blink",
        summary: "A starter walkthrough for wiring an LED and understanding the sketch lifecycle.",
        kind: "hybrid",
        difficulty: "Beginner",
        thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        embedUrl: "https://www.youtube.com/embed/fJWR7dBuc18",
        markdownBody: "# Arduino First Blink\n\nFollow this guide to wire an LED, upload your first sketch, and understand what `setup()` and `loop()` do.\n\n## What you need\n\n- Arduino board\n- USB cable\n- LED and resistor\n\n## Steps\n\n1. Connect the LED to pin 13.\n2. Install Arduino IDE.\n3. Upload the Blink example.\n4. Change the delay values and observe the result.",
        published: true,
        featured: true,
        createdAt: "2026-03-16T12:00:00.000Z",
        updatedAt: "2026-03-16T12:00:00.000Z",
        tags: ["arduino", "electronics"],
    },
    {
        id: "2",
        slug: "fdm-failure-guide",
        title: "Common FDM Print Failures",
        summary: "A written troubleshooting guide for adhesion, layer shifts, and stringing.",
        kind: "article",
        difficulty: "Intermediate",
        thumbnailUrl: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80",
        embedUrl: "",
        markdownBody: "# Common FDM Print Failures\n\nUse this troubleshooting checklist when a print starts drifting, warping, or stringing.\n\n## Quick checks\n\n- Re-level the bed\n- Dry the filament\n- Slow the first layer\n- Inspect belt tension",
        published: true,
        featured: false,
        createdAt: "2026-03-16T12:00:00.000Z",
        updatedAt: "2026-03-16T12:00:00.000Z",
        tags: ["3d-printing", "troubleshooting"],
    },
    {
        id: "3",
        slug: "private-kicad-workflow",
        title: "KiCad Team Workflow",
        summary: "Staff draft for the upcoming advanced PCB curriculum.",
        kind: "video",
        difficulty: "Advanced",
        thumbnailUrl: "",
        embedUrl: "https://player.vimeo.com/video/76979871",
        markdownBody: "# KiCad Team Workflow\n\nDraft content only.",
        published: false,
        featured: false,
        createdAt: "2026-03-16T12:00:00.000Z",
        updatedAt: "2026-03-16T12:00:00.000Z",
        tags: ["pcb", "staff"],
    },
]
