"use client"

import { SignUp } from "@clerk/nextjs"
import { AuthShell } from "@/components/auth/auth-shell"

export default function SignUpPage() {
    return (
        <AuthShell
            title="Create your MakerSpace account."
            description="Registration is temporarily open while the member workspace is still in testing before future billing gates."
        >
            <SignUp
                path="/register"
                signInUrl="/login"
                fallbackRedirectUrl="/dashboard/how-to"
            />
        </AuthShell>
    )
}
