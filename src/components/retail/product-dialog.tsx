"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Product } from "@/lib/mock-data"

interface ProductDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product?: Product | null
    onSave: (product: Product) => void
}

export function ProductDialog({
    open,
    onOpenChange,
    product,
    onSave,
}: ProductDialogProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const data = new FormData(form)
        const price = Number(data.get("price"))

        onSave({
            id: product?.id || crypto.randomUUID(),
            name: String(data.get("name") || ""),
            price: Number.isFinite(price) ? price : 0,
            category: String(data.get("category") || ""),
            description: String(data.get("description") || ""),
            image: product?.image || "/images/placeholder.jpg",
            inStock: product?.inStock ?? true,
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
                    <DialogDescription>
                        {product ? "Make changes to the product here." : "Add a new product to your inventory."}
                    </DialogDescription>
                </DialogHeader>
                <form key={product?.id || "new-product"} onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={product?.name || ""}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            defaultValue={product?.price ?? 0}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category
                        </Label>
                        <Input
                            id="category"
                            name="category"
                            defaultValue={product?.category || ""}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Desc
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue={product?.description || ""}
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
