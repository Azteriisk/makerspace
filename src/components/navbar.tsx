"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, ShoppingCart } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useCart } from "@/context/cart-context"

function CartTrigger() {
    const { setIsOpen, items } = useCart()
    const count = items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Open Cart</span>
            {count > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center rounded-full pointer-events-none">
                    {count}
                </span>
            )}
        </Button>
    )
}

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()

    // Lock body scroll when menu is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; }
    }, [isOpen]);

    const routes = [
        { href: "/education", label: "Education" },
        { href: "/retail", label: "Retail" },
        { href: "/repairs", label: "Repairs" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ]

    const menuVariants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.07,
                delayChildren: 0.2
            }
        }
    } as const;

    const itemVariants = {
        closed: { opacity: 0, x: 20 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Increased padding-x for mobile from px-4 to px-6 */}
            <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-12 relative">
                {/* Left: Logo */}
                <Link href="/" className="flex-none transition-opacity hover:opacity-80 z-50 relative">
                    <Image
                        src="/logo.png"
                        alt="MakerSpace"
                        width={260}
                        height={76}
                        className="h-[50px] w-auto object-contain dark:brightness-100"
                        priority
                    />
                </Link>

                {/* Center: Desktop Nav (Absolutely Positioned) - Stays same */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                    <nav className="flex items-center space-x-8 text-sm font-semibold">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "transition-colors hover:text-primary",
                                    pathname === route.href ? "text-primary bg-primary/10 px-3 py-1 rounded-full" : "text-foreground/70"
                                )}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-4 z-50 relative">
                    {/* Desktop Only Member Button */}
                    <Link href="/login" className="hidden md:block">
                        <Button size="sm" className="font-semibold shadow-md shadow-primary/20">Member Portal</Button>
                    </Link>

                    <CartTrigger />

                    <ThemeToggle />

                    {/* Mobile Menu Trigger */}
                    <button
                        className="inline-flex items-center justify-center rounded-md p-2 -mr-2 text-foreground/70 hover:text-foreground font-medium transition-colors hover:bg-accent md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        <span className="sr-only">Toggle Menu</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 top-0 left-0 h-screen w-screen bg-background/98 backdrop-blur-xl z-40 flex flex-col pt-24 px-8 md:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col space-y-6">
                            {routes.map((route) => (
                                <motion.div key={route.href} variants={itemVariants}>
                                    <Link
                                        href={route.href}
                                        className={cn(
                                            "text-2xl font-bold tracking-tight transition-colors hover:text-primary block py-2 border-b border-border/40",
                                            pathname === route.href ? "text-primary border-primary/50 pl-4" : "text-foreground/80"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {route.label}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div variants={itemVariants} className="pt-6">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full h-12 text-lg font-semibold shadow-xl shadow-primary/20">
                                        Member Portal
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
