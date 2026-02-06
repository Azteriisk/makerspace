"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="container mx-auto px-6 md:px-12 py-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
                        <p className="text-xl text-muted-foreground">
                            Have a question about a workshop, repair, or product? We're here to help.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Visit Us</h3>
                                <p className="text-muted-foreground">
                                    123 Innovation Drive<br />
                                    Conway, AR 72032
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Email Us</h3>
                                <p className="text-muted-foreground">info@makerspacear.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Call Us</h3>
                                <p className="text-muted-foreground">(501) 545-3608</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Hours</h3>
                                <p className="text-muted-foreground">
                                    Mon - Fri: 10am - 8pm<br />
                                    Sat: 9am - 6pm<br />
                                    Sun: Closed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <Card className="shadow-lg border-muted/40">
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Send us a message</h2>
                            <p className="text-sm text-muted-foreground">We usually respond within 24 hours.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First name</label>
                                <Input placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last name</label>
                                <Input placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input placeholder="jane@example.com" type="email" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea
                                placeholder="How can we help you?"
                                className="min-h-[150px]"
                            />
                        </div>
                        <Button className="w-full h-12 text-base font-semibold shadow-md shadow-primary/20">
                            Send Message
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
