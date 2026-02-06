"use client"

import { Event } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface CalendarViewProps {
    events: Event[]
    onSelectEvent: (event: Event) => void
}

export function CalendarView({ events, onSelectEvent }: CalendarViewProps) {
    // Simple March 2026 Calendar Logic
    const daysInMonth = 31
    const firstDayOffset = 0 // March 1st 2026 is a Sunday (0)

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDayOffset }, (_, i) => i)

    const getEventsForDay = (day: number) => {
        return events.filter(e => {
            const date = new Date(e.date + 'T12:00:00') // prevent timezone shift
            return date.getDate() === day && date.getMonth() === 2 // March = 2
        })
    }

    return (
        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 border-b bg-muted/40 text-center py-2 text-sm font-semibold">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d}>{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-[100px] md:auto-rows-[120px]">
                {emptyDays.map(i => (
                    <div key={`empty-${i}`} className="border-r border-b bg-muted/10" />
                ))}
                {days.map(day => {
                    const dayEvents = getEventsForDay(day)
                    return (
                        <div key={day} className="border-r border-b p-1 md:p-2 relative group hover:bg-muted/20 transition-colors">
                            <span className="text-secondary-foreground/50 text-xs font-medium absolute top-1 right-2">{day}</span>
                            <div className="mt-4 space-y-1">
                                {dayEvents.map(event => (
                                    <motion.button
                                        key={event.id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => onSelectEvent(event)}
                                        className="w-full text-left text-[10px] md:text-xs bg-primary/10 text-primary px-1.5 py-1 rounded border border-primary/20 truncate block hover:bg-primary hover:text-primary-foreground transition-colors"
                                    >
                                        {event.time.split(' - ')[0]} {event.title}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
