import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Calendar, GraduationCap, Package } from "lucide-react"

export default function DashboardOverviewPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
                    <p className="text-sm text-muted-foreground">
                        Your existing member portal summary remains here while How-To and Community expand the workspace.
                    </p>
                </div>
                <Button>Download Profile Data</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Workshop</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Intro to Arduino</div>
                        <p className="text-xs text-muted-foreground">Saturday, March 21 at 10:00 AM</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Progress</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Python Basics</div>
                        <p className="text-xs text-muted-foreground">Module 3 of 5 complete</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Order</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Raspberry Pi Kit</div>
                        <p className="text-xs text-muted-foreground">Ordered March 9, 2026</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Latest Badge</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3D Printing Lv.1</div>
                        <p className="text-xs text-muted-foreground">Awarded March 2026</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Schedule</CardTitle>
                        <CardDescription>You have two upcoming sessions this month.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-2xl border bg-background/80 p-4">
                            <p className="font-semibold">Intro to Arduino</p>
                            <p className="text-sm text-muted-foreground">Saturday, March 21 at 10:00 AM</p>
                        </div>
                        <div className="rounded-2xl border bg-background/80 p-4">
                            <p className="font-semibold">Drone Flight and Repair</p>
                            <p className="text-sm text-muted-foreground">Thursday, March 26 at 6:00 PM</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <Award className="mb-2 h-10 w-10 text-primary" />
                            <CardTitle>Certified Python Beginner</CardTitle>
                            <CardDescription>Awarded August 2025</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Download PDF</Button>
                        </CardFooter>
                    </Card>
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <Award className="mb-2 h-10 w-10 text-primary" />
                            <CardTitle>Safety: 3D Printing Lv.1</CardTitle>
                            <CardDescription>Awarded March 2026</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Download PDF</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
