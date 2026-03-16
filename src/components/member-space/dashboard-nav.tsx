"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpenText, LayoutDashboard, MessageSquareText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
    { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/how-to", label: "How-To", icon: BookOpenText },
    { href: "/dashboard/community", label: "Community", icon: MessageSquareText },
    { href: "/dashboard/admin", label: "Admin", icon: Settings },
]

export function DashboardNav({ canAccessAdmin }: { canAccessAdmin: boolean }) {
    const pathname = usePathname()
    const visibleTabs = canAccessAdmin ? tabs : tabs.filter(tab => tab.href !== "/dashboard/admin")

    return (
        <nav className="flex flex-wrap gap-3">
            {visibleTabs.map(tab => {
                const isActive = pathname === tab.href
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                            isActive
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground/70 hover:border-primary/30 hover:text-foreground"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </Link>
                )
            })}
        </nav>
    )
}
