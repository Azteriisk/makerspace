"use client"

import * as React from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { SpacetimeDBProvider, useReducer, useSpacetimeDB } from "spacetimedb/react"
import { AlertTriangle, DatabaseZap, LoaderCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DbConnection, reducers } from "@/module_bindings"

type MemberSpaceProviderProps = {
    children: React.ReactNode
    host: string
    databaseName: string
    jwtTemplateName: string
}

function ConnectionStatusBanner() {
    const state = useSpacetimeDB()

    if (state.isActive) {
        return null
    }

    const title = state.connectionError ? "Realtime backend not connected" : "Connecting member data"
    const description = !state.connectionError
        ? "SpacetimeDB is initializing. Seeded fallback content stays visible until the live connection is ready."
        : "Configure Clerk JWTs and your SpacetimeDB module to enable live tutorials, chat, and admin actions."

    return (
        <Card className="border-dashed border-primary/30 bg-primary/5">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                {!state.connectionError ? (
                    <LoaderCircle className="mt-1 h-5 w-5 animate-spin text-primary" />
                ) : (
                    <AlertTriangle className="mt-1 h-5 w-5 text-primary" />
                )}
                <div className="space-y-1">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    )
}

function ProfileSync() {
    const { user, isLoaded } = useUser()
    const syncProfile = useReducer(reducers.syncProfileFromAuth)

    React.useEffect(() => {
        if (!isLoaded || !user) {
            return
        }

        void syncProfile({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? "",
            displayName: user.fullName ?? user.username ?? "MakerSpace Member",
            avatarUrl: user.imageUrl ?? "",
        })
    }, [isLoaded, syncProfile, user])

    return null
}

export function MemberSpaceProvider({ children, host, databaseName, jwtTemplateName }: MemberSpaceProviderProps) {
    const { getToken, isLoaded } = useAuth()
    const [builder, setBuilder] = React.useState<ReturnType<typeof DbConnection.builder> | null>(null)

    React.useEffect(() => {
        let cancelled = false

        if (!isLoaded) {
            return
        }

        const tokenKey = `spacetimedb/${databaseName || "makerspace"}/auth_token`

        void (async () => {
            const clerkToken = jwtTemplateName
                ? await getToken({ template: jwtTemplateName }).catch(() => null)
                : null
            const cachedToken = typeof window === "undefined" ? undefined : localStorage.getItem(tokenKey) ?? undefined
            const token = clerkToken ?? cachedToken

            const nextBuilder = DbConnection.builder()
                .withUri(host || "ws://127.0.0.1:3000")
                .withDatabaseName(databaseName || "makerspace")
                .withLightMode(true)
                .withToken(token ?? undefined)
                .onConnect((_conn, _identity, nextToken) => {
                    if (typeof window !== "undefined") {
                        localStorage.setItem(tokenKey, nextToken)
                    }
                })
                .onConnectError((_ctx, error) => {
                    console.error("SpacetimeDB connection error:", error)
                })

            if (!cancelled) {
                setBuilder(nextBuilder)
            }
        })()

        return () => {
            cancelled = true
        }
    }, [databaseName, getToken, host, isLoaded, jwtTemplateName])

    if (!builder) {
        return (
            <Card className="border-dashed border-primary/30 bg-primary/5">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <DatabaseZap className="h-5 w-5 text-primary" />
                        <div>
                            <CardTitle className="text-base">Preparing member workspace</CardTitle>
                            <CardDescription>Loading Clerk and SpacetimeDB configuration.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    The dashboard is waiting on auth state so it can request a short-lived SpacetimeDB token.
                </CardContent>
            </Card>
        )
    }

    return (
        <SpacetimeDBProvider connectionBuilder={builder}>
            <div className="space-y-6">
                <ConnectionStatusBanner />
                <ProfileSync />
                {children}
            </div>
        </SpacetimeDBProvider>
    )
}
