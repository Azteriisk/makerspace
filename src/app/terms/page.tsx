import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
    return (
        <div className="container mx-auto px-6 md:px-12 py-12">
            <div className="mx-auto max-w-3xl space-y-8">
                <header className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                    <p className="text-muted-foreground">
                        Last updated: March 16, 2026
                    </p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Terms</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
                        <p>
                            By using MakerSpace services, you agree to follow workshop safety rules and equipment guidelines.
                        </p>
                        <p>
                            Product pricing and workshop availability may change. Repairs are quoted before work begins.
                        </p>
                        <p>
                            For questions about these terms, contact info@makerspacear.com.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
