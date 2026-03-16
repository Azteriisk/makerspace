import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { AdminClient } from "@/components/member-space/admin-client"
import { isSiteAdmin } from "@/lib/member-space/auth"

export default async function DashboardAdminPage() {
    const user = await currentUser()

    if (!isSiteAdmin(user)) {
        notFound()
    }

    return <AdminClient />
}
