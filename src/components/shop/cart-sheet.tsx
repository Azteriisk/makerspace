"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
// Removed ScrollArea due to missing component
import Image from "next/image" // Mocking image if needed or using placeholder
import Link from "next/link"

export function CartSheet() {
    const { isOpen, setIsOpen, items, removeItem, updateQuantity, total } = useCart()

    // Prevent body scroll when cart is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background border-l shadow-2xl z-50 flex flex-col h-full"
                    >
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" /> Shopping Cart
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="text-center text-muted-foreground py-10">
                                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>Your cart is empty.</p>
                                    <Button variant="link" onClick={() => setIsOpen(false)} className="mt-2">
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {items.map(({ product, quantity }) => (
                                        <li key={product.id} className="flex gap-4">
                                            <div className="h-20 w-20 bg-muted rounded-md flex items-center justify-center flex-none">
                                                {/* Placeholder for product image */}
                                                <span className="font-bold text-xl text-muted-foreground">
                                                    {product.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-medium line-clamp-1">{product.name}</h3>
                                                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="flex items-center border rounded-md">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 rounded-none"
                                                            onClick={() => updateQuantity(product.id, quantity - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm">{quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 rounded-none"
                                                            onClick={() => updateQuantity(product.id, quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
                                                        onClick={() => removeItem(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="border-t p-6 space-y-4 bg-muted/5">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Subtotal</span>
                                        <span className="text-sm font-medium">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span className="text-xs">Taxes (Est.)</span>
                                        <span className="text-xs">Calculated at checkout</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t mt-2">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-primary text-xl">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20">
                                        Checkout Now
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
