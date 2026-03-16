import { UserButton } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"
import { MemberSpaceProvider } from "@/components/member-space/provider"
import { DashboardNav } from "@/components/member-space/dashboard-nav"
import { isSiteAdmin } from "@/lib/member-space/auth"

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    await auth.protect()
    const user = await currentUser()
    const canAccessAdmin = isSiteAdmin(user)

    return (
        <div className="container mx-auto px-6 py-10 md:px-12">
            <div className="relative overflow-hidden rounded-3xl border bg-card/80 p-6 shadow-xl shadow-primary/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.1),_transparent_35%)]" />
                <div className="relative space-y-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Member Portal</p>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                    Build, learn, and coordinate from one workspace.
                                </h1>
                                <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
                                    How-To tutorials, private community channels, and future premium member tools now live inside the dashboard shell.
                                </p>
                            </div>
                            <DashboardNav canAccessAdmin={canAccessAdmin} />
                        </div>
                        <div className="flex items-center gap-4 rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                            <div className="space-y-1 text-right">
                                <p className="text-sm font-semibold">{user?.fullName ?? user?.username ?? "MakerSpace Member"}</p>
                                <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress ?? "Signed in"}</p>
                            </div>
                            <UserButton />
                        </div>
                    </div>

                    <MemberSpaceProvider
                        host={process.env.NEXT_PUBLIC_SPACETIMEDB_URI ?? "ws://127.0.0.1:3000"}
                        databaseName={process.env.NEXT_PUBLIC_SPACETIMEDB_MODULE ?? "makerspace"}
                        jwtTemplateName={process.env.CLERK_JWT_TEMPLATE_NAME ?? ""}
                    >
                        {children}
                    </MemberSpaceProvider>
                </div>
            </div>
        </div>
    )
}
