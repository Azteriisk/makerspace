"use client"

import { TEAM_MEMBERS } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-6 md:px-12 py-12 space-y-20">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 max-w-4xl mx-auto"
            >
                <Badge variant="secondary" className="mb-4">Founded in Central Arkansas</Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Making Technology <span className="text-primary">Approachable</span>, <span className="text-primary">Practical</span>, and <span className="text-primary">Inspiring</span>.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    MakerSpace is Arkansas’s first community technology hub — a place where people of all ages can learn, build, and collaborate through hands-on education, maker projects, and real-world tech experiences.
                </p>
            </motion.section>

            {/* Application / Values Grid */}
            <section className="grid md:grid-cols-3 gap-8">
                <Card className="bg-muted/50 border-none shadow-none">
                    <CardHeader>
                        <CardTitle>Education</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Workshops in coding, robotics, drones, and electronics. We prepare youth and adults for modern tech careers.
                    </CardContent>
                </Card>
                <Card className="bg-muted/50 border-none shadow-none">
                    <CardHeader>
                        <CardTitle>Retail & Components</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Your local source for maker components, Raspberry Pi, Arduino kits, and more. No more waiting for shipping.
                    </CardContent>
                </Card>
                <Card className="bg-muted/50 border-none shadow-none">
                    <CardHeader>
                        <CardTitle>Repair & Support</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Affordable tech repair and guided "learn while you fix" sessions to empower you to maintain your own tech.
                    </CardContent>
                </Card>
            </section>

            {/* Founder Vision */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 space-y-6">
                    <h2 className="text-3xl font-bold">Our 5-Year Vision</h2>
                    <p className="text-lg text-muted-foreground">
                        In the next five years, MakerSpace aims to establish two to three locations across Arkansas where people can gather to learn about technology, access tools and supplies, and collaborate on projects that strengthen local innovation.
                    </p>
                    <p className="text-muted-foreground">
                        Each location will serve as a hub for community connection — offering regular workshops, after-school programs for students, and free weekly tech literacy sessions for residents.
                    </p>
                </div>
                <div className="order-1 md:order-2 bg-muted rounded-xl aspect-video flex items-center justify-center text-muted-foreground">
                    {/* Placeholder for Vision Image */}
                    <span>Vision Image / Render</span>
                </div>
            </div>

            {/* Team Section */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold text-center">Meet the Team</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                    {TEAM_MEMBERS.map(member => (
                        <Card key={member.id} className="text-center p-6">
                            <div className="mx-auto mb-4 relative w-24 h-24">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={member.image} alt={member.name} />
                                    <AvatarFallback className="text-lg">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                            </div>
                            <h3 className="font-bold text-xl">{member.name}</h3>
                            <p className="text-primary font-medium mb-4">{member.role}</p>
                            <p className="text-sm text-muted-foreground">{member.bio}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold">Ready to Start Building?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Whether you're looking for a specific component, want to learn a new skill, or need help with a repair, MakerSpace is here for you.
                </p>
            </section>
        </div>
    )
}
