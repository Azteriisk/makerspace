"use client"

import * as React from "react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { useUser } from "@clerk/nextjs"
import { useSpacetimeDB, useTable } from "spacetimedb/react"
import { BookOpen, Clapperboard, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { demoTutorials } from "@/lib/member-space/demo-data"
import { mapTutorials } from "@/lib/member-space/utils"
import { tables } from "@/module_bindings"

export function HowToClient() {
    const { user } = useUser()
    const connection = useSpacetimeDB()
    const [tutorialRows, tutorialsReady] = useTable(tables.tutorial)
    const [tutorialTagRows] = useTable(tables.tutorial_tag)
    const [search, setSearch] = React.useState("")
    const [kindFilter, setKindFilter] = React.useState<"all" | "video" | "article" | "hybrid">("all")
    const [difficultyFilter, setDifficultyFilter] = React.useState("all")
    const deferredSearch = React.useDeferredValue(search)

    const liveTutorials = React.useMemo(
        () => mapTutorials(tutorialRows, tutorialTagRows),
        [tutorialRows, tutorialTagRows]
    )
    const isAdmin = user?.publicMetadata?.siteRole === "owner" || user?.publicMetadata?.siteRole === "admin"
    const shouldUseDemoTutorials = Boolean(connection.connectionError)
    const isLoadingLiveTutorials = !shouldUseDemoTutorials && (!connection.isActive || !tutorialsReady)
    const tutorials = shouldUseDemoTutorials ? demoTutorials : liveTutorials
    const visibleTutorials = tutorials.filter(tutorial => {
        if (!tutorial.published && !isAdmin) {
            return false
        }
        if (kindFilter !== "all" && tutorial.kind !== kindFilter) {
            return false
        }
        if (difficultyFilter !== "all" && tutorial.difficulty !== difficultyFilter) {
            return false
        }
        if (!deferredSearch.trim()) {
            return true
        }
        const query = deferredSearch.toLowerCase()
        return (
            tutorial.title.toLowerCase().includes(query) ||
            tutorial.summary.toLowerCase().includes(query) ||
            tutorial.tags.some(tag => tag.toLowerCase().includes(query))
        )
    })

    const [selectedSlug, setSelectedSlug] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (!visibleTutorials.length) {
            setSelectedSlug(null)
            return
        }

        if (!selectedSlug || !visibleTutorials.some(tutorial => tutorial.slug === selectedSlug)) {
            setSelectedSlug(visibleTutorials[0].slug)
        }
    }, [selectedSlug, visibleTutorials])

    const selectedTutorial = visibleTutorials.find(tutorial => tutorial.slug === selectedSlug) ?? visibleTutorials[0] ?? null
    const featuredTutorial = visibleTutorials.find(tutorial => tutorial.featured) ?? visibleTutorials[0] ?? null
    const difficulties = Array.from(new Set(tutorials.map(tutorial => tutorial.difficulty)))

    if (isLoadingLiveTutorials) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-primary">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-sm font-semibold uppercase tracking-[0.2em]">Featured Guide</span>
                            </div>
                            <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
                            <div className="h-4 w-full animate-pulse rounded bg-muted" />
                            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="aspect-[16/8] animate-pulse rounded-2xl border bg-muted" />
                            <div className="flex flex-wrap gap-2">
                                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                                <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
                                <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Filter the library</CardTitle>
                            <CardDescription>Loading live tutorials from the member workspace.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="h-10 animate-pulse rounded-md bg-muted" />
                            <div className="h-20 animate-pulse rounded-xl bg-muted/70" />
                            <div className="h-20 animate-pulse rounded-xl bg-muted/70" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Card key={index} className="h-full">
                                <CardHeader className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
                                        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
                                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                                    <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="overflow-hidden">
                        <CardHeader className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                                <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
                                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="aspect-video animate-pulse rounded-2xl border bg-muted" />
                            <div className="space-y-3">
                                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-primary">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Featured Guide</span>
                        </div>
                        <CardTitle>{featuredTutorial?.title ?? "How-To Library"}</CardTitle>
                        <CardDescription>{featuredTutorial?.summary ?? "Videos and written guides will appear here."}</CardDescription>
                    </CardHeader>
                    {featuredTutorial && (
                        <CardContent className="space-y-4">
                            {featuredTutorial.thumbnailUrl ? (
                                <div className="relative aspect-[16/8] overflow-hidden rounded-2xl border">
                                    <Image
                                        src={featuredTutorial.thumbnailUrl}
                                        alt={featuredTutorial.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            ) : null}
                            <div className="flex flex-wrap gap-2">
                                <Badge>{featuredTutorial.kind}</Badge>
                                <Badge variant="outline">{featuredTutorial.difficulty}</Badge>
                                {featuredTutorial.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter the library</CardTitle>
                        <CardDescription>Search by title, tag, type, or difficulty.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="Search guides or tags"
                                className="pl-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Type</p>
                            <div className="flex flex-wrap gap-2">
                                {["all", "video", "article", "hybrid"].map(kind => (
                                    <button
                                        key={kind}
                                        type="button"
                                        onClick={() => setKindFilter(kind as typeof kindFilter)}
                                        className={`rounded-full border px-3 py-1 text-sm ${kindFilter === kind ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}
                                    >
                                        {kind}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Difficulty</p>
                            <div className="flex flex-wrap gap-2">
                                {["all", ...difficulties].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setDifficultyFilter(level)}
                                        className={`rounded-full border px-3 py-1 text-sm ${difficultyFilter === level ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Library</h2>
                        <p className="text-sm text-muted-foreground">{visibleTutorials.length} guides</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                        {visibleTutorials.map(tutorial => (
                            <button
                                key={tutorial.id}
                                type="button"
                                onClick={() => setSelectedSlug(tutorial.slug)}
                                className={`text-left ${selectedTutorial?.slug === tutorial.slug ? "ring-2 ring-primary" : ""}`}
                            >
                                <Card className="h-full transition-colors hover:border-primary/40">
                                    <CardHeader className="space-y-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <Badge variant={tutorial.published ? "default" : "outline"}>
                                                {tutorial.published ? "Published" : "Draft"}
                                            </Badge>
                                            <Badge variant="outline">{tutorial.difficulty}</Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                                            <CardDescription>{tutorial.summary}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">
                                            {tutorial.kind === "video" ? <Clapperboard className="mr-1 h-3 w-3" /> : <BookOpen className="mr-1 h-3 w-3" />}
                                            {tutorial.kind}
                                        </Badge>
                                        {tutorial.tags.map(tag => (
                                            <Badge key={tag} variant="outline">{tag}</Badge>
                                        ))}
                                    </CardContent>
                                </Card>
                            </button>
                        ))}
                    </div>
                </div>

                <Card className="overflow-hidden">
                    {selectedTutorial ? (
                        <>
                            <CardHeader className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <Badge>{selectedTutorial.kind}</Badge>
                                    <Badge variant="outline">{selectedTutorial.difficulty}</Badge>
                                    {selectedTutorial.tags.map(tag => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <CardTitle>{selectedTutorial.title}</CardTitle>
                                    <CardDescription>{selectedTutorial.summary}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {selectedTutorial.embedUrl ? (
                                    <div className="aspect-video overflow-hidden rounded-2xl border bg-black">
                                        <iframe
                                            src={selectedTutorial.embedUrl}
                                            title={selectedTutorial.title}
                                            className="h-full w-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : null}
                                <div className="guide-markdown prose prose-neutral max-w-none dark:prose-invert">
                                    <ReactMarkdown>{selectedTutorial.markdownBody}</ReactMarkdown>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <CardContent className="p-8 text-sm text-muted-foreground">
                            No tutorials match the current filters.
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    )
}
