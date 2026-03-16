"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
    const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitState("submitting")

        try {
            await new Promise((resolve) => setTimeout(resolve, 800))
            e.currentTarget.reset()
            setSubmitState("success")
        } catch {
            setSubmitState("error")
        }
    }

    return (
        <div className="container mx-auto px-6 md:px-12 py-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
                        <p className="text-xl text-muted-foreground">
                            Have a question about a workshop, repair, or product? We&apos;re here to help.
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
                    <CardContent className="p-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Send us a message</h2>
                            <p className="text-sm text-muted-foreground">We usually respond within 24 hours.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                                    <Input id="first-name" name="firstName" placeholder="Jane" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                                    <Input id="last-name" name="lastName" placeholder="Doe" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="contact-email" className="text-sm font-medium">Email</label>
                                <Input id="contact-email" name="email" placeholder="jane@example.com" type="email" required />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="contact-message" className="text-sm font-medium">Message</label>
                                <Textarea
                                    id="contact-message"
                                    name="message"
                                    placeholder="How can we help you?"
                                    className="min-h-[150px]"
                                    required
                                />
                            </div>

                            {submitState === "success" && (
                                <p className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-300">
                                    Message sent. We&apos;ll reply soon.
                                </p>
                            )}
                            {submitState === "error" && (
                                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    Something went wrong. Please try again.
                                </p>
                            )}

                            <Button
                                className="w-full h-12 text-base font-semibold shadow-md shadow-primary/20"
                                disabled={submitState === "submitting"}
                            >
                                {submitState === "submitting" ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
