"use client"

import { useState } from "react"
import { INITIAL_PRODUCTS, Product } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, ShoppingCart } from "lucide-react"
import { ProductDialog } from "@/components/retail/product-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/cart-context"

export default function RetailPage() {
    const { addItem } = useCart()
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSaveProduct = (product: Product) => {
        if (editingProduct) {
            setProducts(products.map(p => p.id === product.id ? product : p))
        } else {
            setProducts([...products, product])
        }
        setEditingProduct(null)
    }

    const handleDeleteProduct = (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter(p => p.id !== id))
        }
    }

    return (
        <div className="container mx-auto px-6 md:px-12 py-12 space-y-8">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Retail Shop</h1>
                    <p className="text-muted-foreground mt-2">Components, kits, and tools for your next build.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant={isAdmin ? "default" : "outline"}
                        onClick={() => setIsAdmin(!isAdmin)}
                    >
                        {isAdmin ? "Admin Mode On" : "Admin Mode Off"}
                    </Button>
                    {isAdmin && (
                        <Button onClick={() => { setEditingProduct(null); setIsDialogOpen(true) }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Product
                        </Button>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                        >
                            <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 group">
                                <div className="aspect-square bg-muted relative flex items-center justify-center">
                                    {/* Placeholder Image Logic since we don't have real files yet */}
                                    <div className="text-muted-foreground text-center p-4">
                                        <div className="font-bold text-4xl mb-2">{product.name.charAt(0)}</div>
                                        <span className="text-xs uppercase">{product.category}</span>
                                    </div>
                                    {!product.inStock && (
                                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                            <Badge variant="destructive">Out of Stock</Badge>
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                                            <Badge variant="secondary" className="mt-1 text-xs">{product.category}</Badge>
                                        </div>
                                        <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 flex-grow">
                                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                                </CardContent>
                                <CardFooter className="p-4 border-t bg-muted/20 gap-2">
                                    {isAdmin ? (
                                        <>
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingProduct(product); setIsDialogOpen(true) }}>
                                                <Edit className="h-4 w-4 mr-2" /> Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button className="w-full" disabled={!product.inStock} onClick={() => addItem(product)}>
                                            <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No products found matching "{searchQuery}"
                </div>
            )}

            <ProductDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                product={editingProduct}
                onSave={handleSaveProduct}
            />
        </div>
    )
}
