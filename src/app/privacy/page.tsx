import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-6 md:px-12 py-12">
            <div className="mx-auto max-w-3xl space-y-8">
                <header className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-muted-foreground">
                        Last updated: March 16, 2026
                    </p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>How We Use Your Data</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
                        <p>
                            MakerSpace collects only the information needed to provide classes, purchases, and support.
                        </p>
                        <p>
                            We use contact details to respond to requests and send service updates. We do not sell your personal information.
                        </p>
                        <p>
                            If you would like your data removed or exported, contact info@makerspacear.com.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
