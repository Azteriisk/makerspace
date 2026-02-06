"use client"

import { useState } from "react"
import { INITIAL_EVENTS, Event } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarView } from "@/components/education/calendar-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, User, Users } from "lucide-react"

export default function EducationPage() {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [joinEmail, setJoinEmail] = useState("")

    const handleJoinRequest = (e: React.FormEvent) => {
        e.preventDefault()
        alert(`Request sent for ${selectedEvent?.title}! We will email you at ${joinEmail}.`)
        setJoinEmail("")
        setSelectedEvent(null)
    }

    return (
        <div className="container mx-auto px-6 md:px-12 py-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Workshops & Events</h1>
                    <p className="text-muted-foreground mt-2">March 2026 Schedule</p>
                </div>
            </div>

            <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>

                <TabsContent value="calendar">
                    <CalendarView events={INITIAL_EVENTS} onSelectEvent={setSelectedEvent} />
                </TabsContent>

                <TabsContent value="list">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {INITIAL_EVENTS.map(event => (
                            <Card key={event.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedEvent(event)}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{event.title}</CardTitle>
                                        <span className="text-primary font-bold">${event.price}</span>
                                    </div>
                                    <CardDescription>{event.date} • {event.time}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                        <User className="h-4 w-4" /> {event.instructor}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                                        <Users className="h-4 w-4" /> {event.spotsTotal - event.spotsTaken} spots left
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    {selectedEvent && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedEvent.title}</DialogTitle>
                                <DialogDescription className="text-base mt-2">
                                    {selectedEvent.description}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4 text-sm">
                                    <Calendar className="h-4 w-4 text-primary" /> {selectedEvent.date}
                                    <Clock className="h-4 w-4 text-primary" /> {selectedEvent.time}
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <User className="h-4 w-4 text-primary" /> Instructor: {selectedEvent.instructor}
                                </div>
                                <div className="bg-muted p-4 rounded-md">
                                    <h4 className="font-semibold mb-2">Request to Join</h4>
                                    <form onSubmit={handleJoinRequest} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                required
                                                value={joinEmail}
                                                onChange={(e) => setJoinEmail(e.target.value)}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full">
                                                Send Request (${selectedEvent.price})
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
