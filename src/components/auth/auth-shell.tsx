"use client"

import * as React from "react"

export function AuthShell({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: React.ReactNode
}) {
    return (
        <div className="relative flex min-h-[calc(100vh-200px)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.1),_transparent_30%)]" />
            <div className="relative flex w-full max-w-5xl flex-col items-center gap-8">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Member Access</p>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight">{title}</h1>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                        {description}
                    </p>
                </div>
                <div className="flex w-full justify-center">
                    {children}
                </div>
            </div>
        </div>
    )
}
