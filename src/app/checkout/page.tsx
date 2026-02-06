"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (items.length === 0 && !isSuccess) {
            router.push('/retail')
        }
    }, [items, isSuccess, router])

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsProcessing(false)
        setIsSuccess(true)
        clearCart()
    }

    if (isSuccess) {
        return (
            <div className="container mx-auto px-6 md:px-12 py-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <h1 className="text-4xl font-bold">Order Confirmed!</h1>
                <p className="text-xl text-muted-foreground max-w-md">
                    Thank you for your purchase. We've sent a confirmation email to your inbox.
                </p>
                <div className="pt-8">
                    <Link href="/">
                        <Button size="lg" className="h-12 px-8">Return Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    if (items.length === 0) return null

    return (
        <div className="container mx-auto px-6 md:px-12 py-12">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="you@example.com" required />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="Jane" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Doe" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" placeholder="1234 Main St" required />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2 font-medium">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" placeholder="Little Rock" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" placeholder="AR" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip">Zip Code</Label>
                                        <Input id="zip" placeholder="72201" required />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroup defaultValue="card">
                                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex-1 font-medium cursor-pointer">Credit / Debit Card</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-4 rounded-md opacity-50 cursor-not-allowed">
                                        <RadioGroupItem value="paypal" id="paypal" disabled />
                                        <Label htmlFor="paypal" className="flex-1 font-medium">PayPal (Unavailable)</Label>
                                    </div>
                                </RadioGroup>

                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cardNumber">Card Number</Label>
                                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">Expiry Date</Label>
                                            <Input id="expiry" placeholder="MM/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" placeholder="123" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ul className="space-y-4 max-h-[300px] overflow-y-auto">
                                {items.map(({ product, quantity }) => (
                                    <li key={product.id} className="flex justify-between gap-4 text-sm">
                                        <div className="flex gap-2">
                                            <div className="h-10 w-10 bg-muted rounded flex items-center justify-center font-bold text-xs shrink-0">
                                                {product.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium line-clamp-1">{product.name}</p>
                                                <p className="text-muted-foreground">Qty: {quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Taxes (8%)</span>
                                    <span>${(total * 0.08).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">${(total * 1.08).toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                                type="submit"
                                form="checkout-form"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    `Pay $${(total * 1.08).toFixed(2)}`
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
