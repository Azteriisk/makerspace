import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
            <Tabs defaultValue="member" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="member">Member Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="member">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome Back</CardTitle>
                            <CardDescription>
                                Enter your email to access your Member Portal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Link href="/dashboard" className="w-full">
                                <Button className="w-full">Sign In</Button>
                            </Link>
                            <Button variant="link" className="text-xs text-muted-foreground">Forgot your password?</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Account</CardTitle>
                            <CardDescription>
                                Join MakerSpace to track classes, orders, and certificates.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-email">Email</Label>
                                <Input id="reg-email" type="email" placeholder="m@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-password">Password</Label>
                                <Input id="reg-password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href="/dashboard" className="w-full">
                                <Button className="w-full">Create Account</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
