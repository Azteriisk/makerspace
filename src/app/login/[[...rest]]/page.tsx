"use client"

import { SignIn } from "@clerk/nextjs"
import { AuthShell } from "@/components/auth/auth-shell"

export default function SignInPage() {
    return (
        <AuthShell
            title="Sign in to the member workspace."
            description="Access How-To guides, community channels, and the protected member dashboard."
        >
            <SignIn
                path="/login"
                signInUrl="/login"
                signUpUrl="/register"
                fallbackRedirectUrl="/dashboard/how-to"
            />
        </AuthShell>
    )
}
