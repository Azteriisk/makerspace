type ClerkLikeUser = {
    id: string
    publicMetadata?: Record<string, unknown>
}

export function isSiteAdmin(user: ClerkLikeUser | null) {
    if (!user) {
        return false
    }

    if (process.env.MAKERSPACE_OWNER_CLERK_ID && user.id === process.env.MAKERSPACE_OWNER_CLERK_ID) {
        return true
    }

    const role = user.publicMetadata?.siteRole
    return role === "owner" || role === "admin"
}
