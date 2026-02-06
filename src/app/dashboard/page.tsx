import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "lucide-react" // Wait, Badge is usually a component, let me check if I need to install it. I'll just use basic div for now or install it. I'll stick to basic styling to save time. 
import { Package, GraduationCap, Award, Calendar } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-6 md:px-12 py-10">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Member Portal</h2>
                <div className="flex items-center space-x-2">
                    <Button>Download Profile Data</Button>
                </div>
            </div>

            <Tabs defaultValue="classes" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="classes">My Classes</TabsTrigger>
                    <TabsTrigger value="orders">My Orders</TabsTrigger>
                    <TabsTrigger value="certificates">Certificates</TabsTrigger>
                </TabsList>

                <TabsContent value="classes" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Next Workshop</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Intro to Arduino</div>
                                <p className="text-xs text-muted-foreground">Saturday, Oct 14 • 10:00 AM</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Python Basics</div>
                                <p className="text-xs text-muted-foreground">Module 3 of 5 Completed</p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Upcoming Schedule</CardTitle>
                            <CardDescription>
                                You have 2 upcoming sessions this month.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">No new sessions scheduled.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>
                                View your purchase history from the Retail Shop.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Package className="mr-4 h-8 w-8 text-muted-foreground" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">Raspberry Pi 4 Starter Kit</p>
                                        <p className="text-sm text-muted-foreground">Ordered on Sept 20, 2023</p>
                                    </div>
                                    <div className="font-medium">$120.00</div>
                                </div>
                                <div className="flex items-center">
                                    <Package className="mr-4 h-8 w-8 text-muted-foreground" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">Soldering Iron Station</p>
                                        <p className="text-sm text-muted-foreground">Ordered on Aug 15, 2023</p>
                                    </div>
                                    <div className="font-medium">$45.00</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="certificates" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <Award className="h-10 w-10 text-primary mb-2" />
                                <CardTitle>Certified Python Beginner</CardTitle>
                                <CardDescription>Awarded: Aug 2023</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Download PDF</Button>
                            </CardFooter>
                        </Card>
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <Award className="h-10 w-10 text-primary mb-2" />
                                <CardTitle>Safety: 3D Printing Lv.1</CardTitle>
                                <CardDescription>Awarded: July 2023</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Download PDF</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    )
}
