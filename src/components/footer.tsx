import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t py-8 md:py-12 bg-muted/20">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-12">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="font-bold text-lg">MakerSpace</span>
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        Arkansas's First Community Tech Hub. <br className="hidden md:inline" />
                        Learn. Build. Collaborate.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-muted-foreground items-center">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    <div className="flex gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8">
                        <a href="mailto:info@makerspacear.com" className="hover:text-foreground transition-colors">info@makerspacear.com</a>
                        <span>(501) 545-3608</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
