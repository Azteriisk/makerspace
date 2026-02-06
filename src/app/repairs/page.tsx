"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wrench, Monitor, Smartphone, Cpu, Clock } from "lucide-react"

export default function RepairsPage() {
    const services = [
        {
            title: "Computer Diagnostics",
            price: "$45",
            time: "24-48 Hours",
            desc: "Complete hardware and software diagnostic. Fee waived if repair is approved.",
            icon: Monitor
        },
        {
            title: "Screen Replacement",
            price: "Varies",
            time: "1-2 Hours",
            desc: "High-quality display replacement for laptops and mobile devices.",
            icon: Smartphone
        },
        {
            title: "Data Recovery",
            price: "From $99",
            time: "3-5 Days",
            desc: "Attempt to recover data from failing hard drives or corrupted media.",
            icon: Cpu
        },
        {
            title: "Console Repair",
            price: "From $80",
            time: "3-5 Days",
            desc: "HDMI port replacement, drive issues, and overheating fixes for Xbox/PS5.",
            icon: Wrench
        }
    ]

    return (
        <div className="container mx-auto px-6 md:px-12 py-12 space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <Badge variant="secondary" className="mb-2">Expert Service</Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Repairs & Support</h1>
                <p className="text-xl text-muted-foreground">
                    Don't toss it — fix it. Our technicians provide transparent pricing and expert repairs for your essential tech.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, i) => (
                    <Card key={i} className="bg-muted/50 border-none shadow-sm hover:bg-muted/80 transition-colors">
                        <CardHeader>
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <service.icon className="h-5 w-5" />
                            </div>
                            <CardTitle>{service.title}</CardTitle>
                            <CardDescription>Est. Time: {service.time}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">{service.desc}</p>
                            <div className="font-bold text-lg text-primary">{service.price}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Learn to Fix Section */}
            <div className="bg-primary/5 rounded-3xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-bold">Guided "Learn-to-Fix" Sessions</h2>
                        <p className="text-lg text-muted-foreground">
                            Want to learn how to maintain your own devices? Book a guided session with one of our technicians. We'll walk you through the repair process step-by-step, teaching you valuable skills for the future.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>$60 / Hour (Includes tool usage)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Wrench className="h-4 w-4 text-primary" />
                                <span>No experience necessary</span>
                            </li>
                        </ul>
                        <Button size="lg" className="shadow-lg shadow-primary/20">Book a Session</Button>
                    </div>
                    <div className="flex-1 w-full max-w-sm aspect-square bg-background rounded-2xl shadow-2xl flex items-center justify-center text-muted-foreground border">
                        {/* Placeholder Image */}
                        <span>Session Image</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
