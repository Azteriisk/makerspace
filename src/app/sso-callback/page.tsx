"use client"

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"

export default function SsoCallbackPage() {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
            <AuthenticateWithRedirectCallback />
        </div>
    )
}
