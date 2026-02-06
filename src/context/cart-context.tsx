"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Product } from "@/lib/mock-data"

export type CartItem = {
    product: Product
    quantity: number
}

type CartContextType = {
    items: CartItem[]
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    addItem: (product: Product) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const saved = localStorage.getItem("cart")
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to load cart", e)
            }
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("cart", JSON.stringify(items))
        }
    }, [items, isMounted])

    const addItem = (product: Product) => {
        setItems(prev => {
            const existing = prev.find(item => item.product.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { product, quantity: 1 }]
        })
        setIsOpen(true)
    }

    const removeItem = (productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId)
            return
        }
        setItems(prev => prev.map(item =>
            item.product.id === productId
                ? { ...item, quantity }
                : item
        ))
    }

    const clearCart = () => setItems([])

    const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)

    return (
        <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart, total }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
