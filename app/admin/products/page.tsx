"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Search, ArrowLeft, Package, Star, X, Upload, ImageIcon } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

// Initial sample products with updated structure
const initialProducts = [
  {
    id: 1,
    name_en: "Premium Cotton Shirt",
    name_ar: "قميص قطني فاخر",
    price: 299,
    images: ["/mens-white-dress-shirt.png", "/white-dress-shirt-front.png", "/white-dress-shirt-back.png"],
    category: { en: "Shirts", ar: "قمصان" },
    description_en: "High-quality cotton dress shirt perfect for formal occasions",
    description_ar: "قميص قطني عالي الجودة مثالي للمناسبات الرسمية",
    rating: 4.8,
    stock: 100,
    colors: ["Black", "White", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name_en: "Classic Denim Jeans",
    name_ar: "جينز كلاسيكي",
    price: 450,
    images: ["/mens-classic-blue-jeans.png", "/blue-jeans-side.png", "/blue-jeans-back-pocket.png"],
    category: { en: "Jeans", ar: "جينز" },
    description_en: "Comfortable and stylish denim jeans for everyday wear",
    description_ar: "جينز مريح وأنيق للارتداء اليومي",
    rating: 4.6,
    stock: 100,
    colors: ["Black", "Blue"],
    sizes: ["S", "M", "L"],
  },
  {
    id: 3,
    name_en: "Wool Blazer",
    name_ar: "بليزر صوفي",
    price: 899,
    images: ["/mens-navy-wool-blazer.png", "/placeholder-m5etl.png", "/navy-blazer-detail.png"],
    category: { en: "Blazers", ar: "بليزرات" },
    description_en: "Sophisticated wool blazer for business and formal events",
    description_ar: "بليزر صوفي أنيق للأعمال والمناسبات الرسمية",
    rating: 4.9,
    stock: 100,
    colors: ["Navy", "Gray"],
    sizes: ["S", "M"],
  },
]

const categories = [
  { en: "Shirts", ar: "قمصان" },
  { en: "Jeans", ar: "جينز" },
  { en: "Blazers", ar: "بليزرات" },
  { en: "T-Shirts", ar: "تي شيرت" },
  { en: "Trousers", ar: "بناطيل" },
  { en: "Jackets", ar: "جاكيتات" },
]

const availableColors = [
  "Black",
  "White",
  "Navy",
  "Gray",
  "Blue",
  "Brown",
  "Red",
  "Green",
  "Pink",
  "Purple",
  "Orange",
  "Yellow",
  "Beige",
  "Maroon",
  "Olive",
  "Teal",
]

const availableSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
  "7XL",
  "8XL",
  "10",
  "12",
  "14",
  "16",
  "18",
  "20",
  "22",
  "24",
  "26",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "48",
  "50",
  "52",
  "54",
  "56",
  "58",
  "60",
]

const colorTranslations = {
  en: {
    Black: "Black",
    White: "White",
    Navy: "Navy",
    Gray: "Gray",
    Blue: "Blue",
    Brown: "Brown",
    Red: "Red",
    Green: "Green",
    Pink: "Pink",
    Purple: "Purple",
    Orange: "Orange",
    Yellow: "Yellow",
    Beige: "Beige",
    Maroon: "Maroon",
    Olive: "Olive",
    Teal: "Teal",
  },
  ar: {
    Black: "أسود",
    White: "أبيض",
    Navy: "كحلي",
    Gray: "رمادي",
    Blue: "أزرق",
    Brown: "بني",
    Red: "أحمر",
    Green: "أخضر",
    Pink: "وردي",
    Purple: "بنفسجي",
    Orange: "برتقالي",
    Yellow: "أصفر",
    Beige: "بيج",
    Maroon: "عنابي",
    Olive: "زيتوني",
    Teal: "أزرق مخضر",
  },
}

const sizeTranslations = {
  en: { XS: "Extra Small", S: "Small", M: "Medium", L: "Large", XL: "Extra Large", XXL: "Double XL" },
  ar: { XS: "صغير جداً", S: "صغير", M: "متوسط", L: "كبير", XL: "كبير جداً", XXL: "كبير جداً جداً" },
}

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([])
  const router = useRouter()

  const [newProduct, setNewProduct] = useState({
    name_en: "",
    name_ar: "",
    price: 0,
    images: [""],
    category: { en: "", ar: "" },
    description_en: "",
    description_ar: "",
    rating: 4.0,
    stock_status: "In Stock",
    colors: [] as string[],
    sizes: [] as string[],
  })

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("adminAuth")
    if (authStatus !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      loadProducts()
    }
  }, [router])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading products:", error)
        return
      }

      if (data) {
        setProducts(data)
      }
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_ar?.includes(searchTerm) ||
      product.category.en?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addImageField = () => {
    setNewProduct({ ...newProduct, images: [...newProduct.images, ""] })
  }

  const removeImageField = (index: number) => {
    const newImages = newProduct.images.filter((_, i) => i !== index)
    setNewProduct({ ...newProduct, images: newImages.length > 0 ? newImages : [""] })
  }

  const updateImageField = (index: number, value: string) => {
    const newImages = [...newProduct.images]
    newImages[index] = value
    setNewProduct({ ...newProduct, images: newImages })
  }

  const toggleColor = (color: string) => {
    const newColors = newProduct.colors.includes(color)
      ? newProduct.colors.filter((c) => c !== color)
      : [...newProduct.colors, color]
    setNewProduct({ ...newProduct, colors: newColors })
  }

  const toggleSize = (size: string) => {
    const newSizes = newProduct.sizes.includes(size)
      ? newProduct.sizes.filter((s) => s !== size)
      : [...newProduct.sizes, size]
    setNewProduct({ ...newProduct, sizes: newSizes })
  }

  const handleAddProduct = async () => {
    if (
      newProduct.name_en &&
      newProduct.name_ar &&
      newProduct.price > 0 &&
      newProduct.colors.length > 0 &&
      newProduct.sizes.length > 0
    ) {
      try {
        const productData = {
          name: newProduct.name_en,
          name_ar: newProduct.name_ar,
          price: newProduct.price,
          images: newProduct.images.filter((img) => img.trim() !== ""),
          category: newProduct.category,
          description: newProduct.description_en,
          description_ar: newProduct.description_ar,
          rating: newProduct.rating,
          stock: newProduct.stock_status === "In Stock" ? 100 : 0,
          colors: newProduct.colors,
          sizes: newProduct.sizes,
        }

        const { error } = await supabase.from("products").insert([productData])

        if (error) {
          console.error("Error adding product:", error)
          alert("Error adding product. Please try again.")
          return
        }

        // Reload products
        await loadProducts()

        setNewProduct({
          name_en: "",
          name_ar: "",
          price: 0,
          images: [""],
          category: { en: "", ar: "" },
          description_en: "",
          description_ar: "",
          rating: 4.0,
          stock_status: "In Stock",
          colors: [],
          sizes: [],
        })
        setIsAddDialogOpen(false)
        alert("Product added successfully!")
      } catch (error) {
        console.error("Error adding product:", error)
        alert("Error adding product. Please try again.")
      }
    } else {
      alert("Please fill in all required fields including colors and sizes.")
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct({
      ...product,
      images: product.images || [product.image || "/placeholder.svg"],
      colors: product.colors || ["Black", "White"],
      sizes: product.sizes || ["S", "M", "L"],
    })
  }

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      try {
        const { error } = await supabase
          .from("products")
          .update({
            ...editingProduct,
            images: editingProduct.images.filter((img: string) => img.trim() !== ""),
            stock: editingProduct.stock_status === "In Stock" ? 100 : 0,
          })
          .eq("id", editingProduct.id)

        if (error) {
          console.error("Error updating product:", error)
          alert("Error updating product. Please try again.")
          return
        }

        // Reload products
        await loadProducts()
        setEditingProduct(null)
        alert("Product updated successfully!")
      } catch (error) {
        console.error("Error updating product:", error)
        alert("Error updating product. Please try again.")
      }
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) {
        console.error("Error deleting product:", error)
        alert("Error deleting product. Please try again.")
        return
      }

      // Reload products
      await loadProducts()
      alert("Product deleted successfully!")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product. Please try again.")
    }
  }

  const handleImageUpload = async (file: File, index: number, isEditing = false) => {
    if (!file) return

    const newUploadingImages = [...uploadingImages]
    newUploadingImages[index] = true
    setUploadingImages(newUploadingImages)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()

      if (isEditing && editingProduct) {
        const newImages = [...editingProduct.images]
        newImages[index] = result.url
        setEditingProduct({ ...editingProduct, images: newImages })
      } else {
        const newImages = [...newProduct.images]
        newImages[index] = result.url
        setNewProduct({ ...newProduct, images: newImages })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error uploading image. Please try again.")
    } finally {
      const newUploadingImages = [...uploadingImages]
      newUploadingImages[index] = false
      setUploadingImages(newUploadingImages)
    }
  }

  const ImageField = ({ image, index, onChange, onUpload, isUploading }: any) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          value={image}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder={`Image URL ${index + 1}`}
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
        <div className="flex space-x-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onUpload(file, index)
              }}
              className="hidden"
            />
            <Button type="button" size="sm" disabled={isUploading} className="bg-blue-600 hover:bg-blue-700">
              {isUploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </Button>
          </label>
          {newProduct.images.length > 1 && (
            <Button
              type="button"
              onClick={() => removeImageField(index)}
              size="sm"
              variant="outline"
              className="border-gray-600 text-red-400 hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {image && (
        <div className="mt-2">
          <img
            src={image || "/placeholder.svg"}
            alt={`Preview ${index + 1}`}
            className="w-20 h-20 object-cover rounded border border-gray-600"
          />
        </div>
      )}
    </div>
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
          <p className="mt-2 text-gray-300">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-white">Product Management</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name-en" className="text-gray-200">
                          Product Name (English)
                        </Label>
                        <Input
                          id="name-en"
                          value={newProduct.name_en}
                          onChange={(e) => setNewProduct({ ...newProduct, name_en: e.target.value })}
                          placeholder="Enter English name"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name-ar" className="text-gray-200">
                          Product Name (Arabic)
                        </Label>
                        <Input
                          id="name-ar"
                          value={newProduct.name_ar}
                          onChange={(e) => setNewProduct({ ...newProduct, name_ar: e.target.value })}
                          placeholder="Enter Arabic name"
                          dir="rtl"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-gray-200">
                          Price (₪)
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                          placeholder="Enter price"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-gray-200">
                          Category
                        </Label>
                        <select
                          value={newProduct.category.en}
                          onChange={(e) => {
                            const selectedCategory = categories.find((cat) => cat.en === e.target.value)
                            if (selectedCategory) {
                              setNewProduct({
                                ...newProduct,
                                category: { en: selectedCategory.en, ar: selectedCategory.ar },
                              })
                            }
                          }}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.en} value={category.en}>
                              {category.en} / {category.ar}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-200 flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Product Images
                        </Label>
                        <Button
                          type="button"
                          onClick={addImageField}
                          size="sm"
                          className="bg-gray-700 hover:bg-gray-600"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Image
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {newProduct.images.map((image, index) => (
                          <ImageField
                            key={index}
                            image={image}
                            index={index}
                            onChange={updateImageField}
                            onUpload={(file: File, idx: number) => handleImageUpload(file, idx, false)}
                            isUploading={uploadingImages[index]}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-gray-200">Available Colors (Select Multiple)</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {availableColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => toggleColor(color)}
                            className={`p-3 rounded border text-sm transition-all duration-200 ${
                              newProduct.colors.includes(color)
                                ? "border-green-500 bg-green-600 text-white"
                                : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                            }`}
                          >
                            {colorTranslations.en[color as keyof typeof colorTranslations.en]}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-400">Selected: {newProduct.colors.join(", ") || "None"}</p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-gray-200">Available Sizes (Select Multiple)</Label>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Clothing Sizes:</p>
                          <div className="grid grid-cols-6 gap-2">
                            {availableSizes.slice(0, 12).map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`p-2 rounded border text-sm transition-all duration-200 ${
                                  newProduct.sizes.includes(size)
                                    ? "border-green-500 bg-green-600 text-white"
                                    : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Numeric Sizes:</p>
                          <div className="grid grid-cols-8 gap-2">
                            {availableSizes.slice(12).map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`p-2 rounded border text-sm transition-all duration-200 ${
                                  newProduct.sizes.includes(size)
                                    ? "border-green-500 bg-green-600 text-white"
                                    : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">Selected: {newProduct.sizes.join(", ") || "None"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="desc-en" className="text-gray-200">
                          Description (English)
                        </Label>
                        <Textarea
                          id="desc-en"
                          value={newProduct.description_en}
                          onChange={(e) => setNewProduct({ ...newProduct, description_en: e.target.value })}
                          placeholder="Enter English description"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="desc-ar" className="text-gray-200">
                          Description (Arabic)
                        </Label>
                        <Textarea
                          id="desc-ar"
                          value={newProduct.description_ar}
                          onChange={(e) => setNewProduct({ ...newProduct, description_ar: e.target.value })}
                          dir="rtl"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rating" className="text-gray-200">
                          Rating
                        </Label>
                        <Input
                          id="rating"
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          value={newProduct.rating}
                          onChange={(e) => setNewProduct({ ...newProduct, rating: Number(e.target.value) })}
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock" className="text-gray-200">
                          Stock Status
                        </Label>
                        <Select
                          value={newProduct.stock_status}
                          onValueChange={(value) => setNewProduct({ ...newProduct, stock_status: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue className="text-gray-400" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="In Stock" className="text-gray-300">
                              In Stock
                            </SelectItem>
                            <SelectItem value="Out of Stock" className="text-gray-300">
                              Out of Stock
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="border-gray-600 text-gray-200 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddProduct} className="bg-gray-700 hover:bg-gray-600 text-white">
                        Add Product
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Total Products</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{products.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">In Stock</CardTitle>
              <Badge className="bg-gray-700 text-white">✓</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{products.filter((p) => p.stock > 0).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Out of Stock</CardTitle>
              <Badge variant="destructive" className="bg-red-900 text-red-200">
                ✗
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{products.filter((p) => p.stock === 0).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Avg Rating</CardTitle>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {(products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Images</TableHead>
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Price</TableHead>
                  <TableHead className="text-gray-300">Variants</TableHead>
                  <TableHead className="text-gray-300">Rating</TableHead>
                  <TableHead className="text-gray-300">Stock</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-gray-700">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <img
                          src={product.images?.[0] || product.image || "/placeholder.svg"}
                          alt={product.name_en}
                          className="w-12 h-12 object-cover rounded"
                        />
                        {product.images && product.images.length > 1 && (
                          <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                            +{product.images.length - 1}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{product.name_en}</p>
                        <p className="text-sm text-gray-400" dir="rtl">
                          {product.name_ar}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-white">{product.category.en}</p>
                        <p className="text-sm text-gray-400" dir="rtl">
                          {product.category.ar}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-white">₪{product.price}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {product.colors?.slice(0, 3).map((color: string) => (
                            <Badge key={color} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {color}
                            </Badge>
                          ))}
                          {product.colors && product.colors.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                              +{product.colors.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes?.slice(0, 4).map((size: string) => (
                            <Badge key={size} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              {size}
                            </Badge>
                          ))}
                          {product.sizes && product.sizes.length > 4 && (
                            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              +{product.sizes.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-gray-300">{product.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.stock > 0 ? "default" : "destructive"}
                        className={product.stock > 0 ? "bg-gray-700 text-white" : "bg-red-900 text-red-200"}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="border-gray-600 text-gray-200 hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-gray-700 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete Product</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                Are you sure you want to delete "{product.name_en}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-600 text-gray-200 hover:bg-gray-700">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p>No products found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name-en" className="text-gray-200">
                    Product Name (English)
                  </Label>
                  <Input
                    id="edit-name-en"
                    value={editingProduct.name_en}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name-ar" className="text-gray-200">
                    Product Name (Arabic)
                  </Label>
                  <Input
                    id="edit-name-ar"
                    value={editingProduct.name_ar}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
                    dir="rtl"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price" className="text-gray-200">
                    Price (₪)
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category" className="text-gray-200">
                    Category
                  </Label>
                  <select
                    value={editingProduct.category.en}
                    onChange={(e) => {
                      const selectedCategory = categories.find((cat) => cat.en === e.target.value)
                      if (selectedCategory) {
                        setEditingProduct({
                          ...editingProduct,
                          category: { en: selectedCategory.en, ar: selectedCategory.ar },
                        })
                      }
                    }}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.en} value={category.en}>
                        {category.en} / {category.ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-200">Product Images</Label>
                  <Button
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, images: [...editingProduct.images, ""] })}
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                </div>
                <div className="space-y-2">
                  {editingProduct.images?.map((image: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={image}
                        onChange={(e) => {
                          const newImages = [...editingProduct.images]
                          newImages[index] = e.target.value
                          setEditingProduct({ ...editingProduct, images: newImages })
                        }}
                        placeholder={`Image URL ${index + 1}`}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                      {editingProduct.images.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => {
                            const newImages = editingProduct.images.filter((_: string, i: number) => i !== index)
                            setEditingProduct({ ...editingProduct, images: newImages.length > 0 ? newImages : [""] })
                          }}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-red-400 hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-gray-200">Available Colors</Label>
                <div className="grid grid-cols-4 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        const newColors = editingProduct.colors?.includes(color)
                          ? editingProduct.colors.filter((c: string) => c !== color)
                          : [...(editingProduct.colors || []), color]
                        setEditingProduct({ ...editingProduct, colors: newColors })
                      }}
                      className={`p-3 rounded border text-sm transition-all duration-200 ${
                        editingProduct.colors?.includes(color)
                          ? "border-green-500 bg-green-600 text-white"
                          : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {colorTranslations.en[color as keyof typeof colorTranslations.en]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-gray-200">Available Sizes</Label>
                <div className="grid grid-cols-6 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const newSizes = editingProduct.sizes?.includes(size)
                          ? editingProduct.sizes.filter((s: string) => s !== size)
                          : [...(editingProduct.sizes || []), size]
                        setEditingProduct({ ...editingProduct, sizes: newSizes })
                      }}
                      className={`p-3 rounded border text-sm transition-all duration-200 ${
                        editingProduct.sizes?.includes(size)
                          ? "border-green-500 bg-green-600 text-white"
                          : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-desc-en" className="text-gray-200">
                    Description (English)
                  </Label>
                  <Textarea
                    id="edit-desc-en"
                    value={editingProduct.description_en}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_en: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-desc-ar" className="text-gray-200">
                    Description (Arabic)
                  </Label>
                  <Textarea
                    id="edit-desc-ar"
                    value={editingProduct.description_ar}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
                    dir="rtl"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-rating" className="text-gray-200">
                    Rating
                  </Label>
                  <Input
                    id="edit-rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={editingProduct.rating}
                    onChange={(e) => setEditingProduct({ ...editingProduct, rating: Number(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock" className="text-gray-200">
                    Stock Status
                  </Label>
                  <Select
                    value={editingProduct.stock_status}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, stock_status: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue className="text-gray-400" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="In Stock" className="text-gray-300">
                        In Stock
                      </SelectItem>
                      <SelectItem value="Out of Stock" className="text-gray-300">
                        Out of Stock
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                  className="border-gray-600 text-gray-200 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateProduct} className="bg-gray-700 hover:bg-gray-600 text-white">
                  Update Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
