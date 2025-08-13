"use client"

import { useState, useMemo, useEffect } from "react"

export default function JibreelSeriesStore() {
  const [language, setLanguage] = useState<"en" | "ar">("en")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [cart, setCart] = useState<any[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [addedToCart, setAddedToCart] = useState<number | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
  })
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(new Set())
  const [showVariantDialog, setShowVariantDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedVariants, setSelectedVariants] = useState({
    color: "",
    size: "",
    quantity: 1,
  })
  const [showImageCarousel, setShowImageCarousel] = useState(false)
  const [carouselProduct, setCarouselProduct] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const isRTL = language === "ar"

  const sampleProducts = [
    {
      id: 1,
      name: { en: "Classic White Dress Shirt", ar: "قميص أبيض كلاسيكي" },
      category: { en: "Shirts", ar: "قمصان" },
      price: 299,
      rating: 4.8,
      inStock: true,
      description: {
        en: "Premium cotton dress shirt perfect for formal occasions",
        ar: "قميص قطني فاخر مثالي للمناسبات الرسمية",
      },
      images: ["/mens-white-dress-shirt.png", "/white-dress-shirt-front.png", "/white-dress-shirt-back.png"],
      colors: ["White", "Light Blue", "Light Pink"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colorNames: {
        en: { White: "White", "Light Blue": "Light Blue", "Light Pink": "Light Pink" },
        ar: { White: "أبيض", "Light Blue": "أزرق فاتح", "Light Pink": "وردي فاتح" },
      },
      sizeNames: {
        en: { S: "Small", M: "Medium", L: "Large", XL: "Extra Large", XXL: "Double XL" },
        ar: { S: "صغير", M: "متوسط", L: "كبير", XL: "كبير جداً", XXL: "كبير جداً جداً" },
      },
    },
    {
      id: 2,
      name: { en: "Classic Blue Jeans", ar: "جينز أزرق كلاسيكي" },
      category: { en: "Jeans", ar: "جينز" },
      price: 450,
      rating: 4.6,
      inStock: true,
      description: {
        en: "Comfortable and durable denim jeans for everyday wear",
        ar: "جينز دنيم مريح ومتين للارتداء اليومي",
      },
      images: ["/mens-classic-blue-jeans.png", "/blue-jeans-side.png", "/blue-jeans-back-pocket.png"],
      colors: ["Dark Blue", "Light Blue", "Black"],
      sizes: ["28", "30", "32", "34", "36", "38"],
      colorNames: {
        en: { "Dark Blue": "Dark Blue", "Light Blue": "Light Blue", Black: "Black" },
        ar: { "Dark Blue": "أزرق داكن", "Light Blue": "أزرق فاتح", Black: "أسود" },
      },
      sizeNames: {
        en: { "28": "28", "30": "30", "32": "32", "34": "34", "36": "36", "38": "38" },
        ar: { "28": "28", "30": "30", "32": "32", "34": "34", "36": "36", "38": "38" },
      },
    },
    {
      id: 3,
      name: { en: "Navy Wool Blazer", ar: "بليزر صوفي كحلي" },
      category: { en: "Blazers", ar: "بليزرات" },
      price: 899,
      rating: 4.9,
      inStock: true,
      description: {
        en: "Elegant wool blazer for professional and formal settings",
        ar: "بليزر صوفي أنيق للإعدادات المهنية والرسمية",
      },
      images: ["/mens-navy-wool-blazer.png", "/navy-blazer-detail.png", "/placeholder.svg"],
      colors: ["Navy", "Charcoal", "Black"],
      sizes: ["S", "M", "L", "XL"],
      colorNames: {
        en: { Navy: "Navy", Charcoal: "Charcoal", Black: "Black" },
        ar: { Navy: "كحلي", Charcoal: "فحمي", Black: "أسود" },
      },
      sizeNames: {
        en: { S: "Small", M: "Medium", L: "Large", XL: "Extra Large" },
        ar: { S: "صغير", M: "متوسط", L: "كبير", XL: "كبير جداً" },
      },
    },
  ]

  // Moved translations and filteredProducts before useEffect to fix initialization order
  const translations = {
    en: {
      title: "Jibreel Series",
      subtitle: "Premium Men's Fashion for the Modern Gentleman",
      search: "Search products...",
      categories: "Categories",
      cart: "Cart",
      contact: "Contact Us",
      language: "Language",
      addToCart: "Add to Cart",
      outOfStock: "Out of Stock",
      checkout: "Checkout",
      total: "Total",
      customerDetails: "Customer Details",
      fullName: "Full Name",
      phoneNumber: "WhatsApp Number",
      address: "Address",
      placeOrder: "Place Order",
      orderPlaced: "Order Placed Successfully!",
      shekel: "₪",
      rating: "Rating",
      inStock: "In Stock",
      shopNow: "Shop Now",
      featuredProducts: "Featured Products",
      allProducts: "All Products",
    },
    ar: {
      title: "سلسلة جبريل",
      subtitle: "أزياء رجالية فاخرة للرجل العصري",
      search: "البحث عن المنتجات...",
      categories: "الفئات",
      cart: "السلة",
      contact: "اتصل بنا",
      language: "اللغة",
      addToCart: "أضف للسلة",
      outOfStock: "غير متوفر",
      checkout: "الدفع",
      total: "المجموع",
      customerDetails: "بيانات العميل",
      fullName: "الاسم الكامل",
      phoneNumber: "رقم الواتساب",
      address: "العنوان",
      placeOrder: "تأكيد الطلب",
      orderPlaced: "تم تأكيد الطلب بنجاح!",
      shekel: "₪",
      rating: "التقييم",
      inStock: "متوفر",
      shopNow: "تسوق الآن",
      featuredProducts: "المنتجات المميزة",
      allProducts: "جميع المنتجات",
    },
  }

  const t = translations[language]

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name[language].toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category[language] === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory, language, products])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const productId = Number.parseInt(entry.target.getAttribute("data-product-id") || "0")
          if (entry.isIntersecting) {
            setVisibleProducts((prev) => new Set([...prev, productId]))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    )

    const productCards = document.querySelectorAll("[data-product-id]")
    productCards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [filteredProducts])

  useEffect(() => {
    const savedProducts = localStorage.getItem("storeProducts")
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        const productsWithImages = parsedProducts.map((product: any) => ({
          ...product,
          images: product.images || ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
          colors: product.colors || ["Black", "White", "Navy", "Gray"],
          sizes: product.sizes || ["S", "M", "L", "XL"],
          colorNames: product.colorNames || {
            en: { Black: "Black", White: "White", Navy: "Navy", Gray: "Gray" },
            ar: { Black: "أسود", White: "أبيض", Navy: "كحلي", Gray: "رمادي" },
          },
          sizeNames: product.sizeNames || {
            en: { S: "Small", M: "Medium", L: "Large", XL: "Extra Large" },
            ar: { S: "صغير", M: "متوسط", L: "كبير", XL: "كبير جداً" },
          },
        }))
        setProducts(productsWithImages)
      } catch (error) {
        console.error("Error loading products:", error)
        setProducts(sampleProducts)
      }
    } else {
      setProducts(sampleProducts)
    }
  }, [])

  // Added image carousel functions
  const openImageCarousel = (product: any, imageIndex = 0) => {
    setCarouselProduct(product)
    setCurrentImageIndex(imageIndex)
    setShowImageCarousel(true)
  }

  const nextImage = () => {
    if (carouselProduct?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % carouselProduct.images.length)
    }
  }

  const prevImage = () => {
    if (carouselProduct?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + carouselProduct.images.length) % carouselProduct.images.length)
    }
  }

  const handleAddToCartClick = (product: any) => {
    setSelectedProduct(product)
    setSelectedVariants({
      color: product.colors?.[0] || "",
      size: product.sizes?.[0] || "",
      quantity: 1,
    })
    setShowVariantDialog(true)
  }

  const addToCart = (product: any, variants: any) => {
    setAddingToCart(product.id)

    setTimeout(() => {
      const cartItem = {
        ...product,
        cartId: Date.now(),
        selectedColor: variants.color,
        selectedSize: variants.size,
        quantity: variants.quantity,
      }

      setCart((prev) => [...prev, cartItem])
      setAddingToCart(null)
      setAddedToCart(product.id)
      setShowVariantDialog(false)

      setTimeout(() => setAddedToCart(null), 2000)
    }, 800)
  }

  const removeFromCart = (cartId: number) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId))
  }

  const updateCartQuantity = (cartId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId)
      return
    }
    setCart((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, quantity: newQuantity } : item)))
  }

  const handleCheckout = () => {
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
      alert(language === "en" ? "Please fill in all fields" : "يرجى ملء جميع الحقول")
      return
    }

    const order = {
      id: Date.now(),
      items: cart,
      customer: customerInfo,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      status: "pending",
    }

    const existingOrders = JSON.parse(localStorage.getItem("storeOrders") || "[]")
    localStorage.setItem("storeOrders", JSON.stringify([...existingOrders, order]))

    setCart([])
    setCustomerInfo({ fullName: "", phone: "", address: "" })
    setShowCheckout(false)
    alert(t.orderPlaced)
  }

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category[language])))]

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${isRTL ? "rtl" : "ltr"}`}>
      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">{t.title}</h1>
              <a href="/admin/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Admin
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
              >
                {language === "en" ? "العربية" : "English"}
              </button>

              {/* Cart */}
              <button
                onClick={() => setShowCheckout(true)}
                className="relative p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
                  />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Contact WhatsApp */}
              <a
                href="https://wa.me/972599765211"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm transition-colors"
              >
                {t.contact}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">{t.title}</h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-delay">{t.subtitle}</p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-8 text-center">{t.allProducts}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                data-product-id={product.id}
                className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
                  visibleProducts.has(product.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden group">
                  <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name[language]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                    onClick={() => openImageCarousel(product, 0)}
                  />
                  {!product.inStock && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs">
                      {t.outOfStock}
                    </div>
                  )}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                      +{product.images.length - 1}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2 text-white">{product.name[language]}</h4>
                  <p className="text-gray-400 text-sm mb-3">{product.description?.[language] || ""}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-300 ml-1">{product.rating}</span>
                    </div>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        product.inStock ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                    >
                      {product.inStock ? t.inStock : t.outOfStock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-400">
                      {t.shekel}
                      {product.price}
                    </span>

                    <button
                      onClick={() => handleAddToCartClick(product)}
                      disabled={!product.inStock || addingToCart === product.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        !product.inStock
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : addingToCart === product.id
                            ? "bg-yellow-600 text-white"
                            : addedToCart === product.id
                              ? "bg-green-600 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg transform hover:scale-105"
                      }`}
                    >
                      {addingToCart === product.id ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding...
                        </div>
                      ) : addedToCart === product.id ? (
                        "✓ Added!"
                      ) : (
                        t.addToCart
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Variant Selection Dialog */}
      {showVariantDialog && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{selectedProduct.name[language]}</h3>

            {/* Color Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{language === "en" ? "Color" : "اللون"}</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors?.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedVariants((prev) => ({ ...prev, color }))}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      selectedVariants.color === color
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {selectedProduct.colorNames?.[language]?.[color] || color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{language === "en" ? "Size" : "المقاس"}</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes?.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedVariants((prev) => ({ ...prev, size }))}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      selectedVariants.size === size
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {selectedProduct.sizeNames?.[language]?.[size] || size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{language === "en" ? "Quantity" : "الكمية"}</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    setSelectedVariants((prev) => ({
                      ...prev,
                      quantity: Math.max(1, prev.quantity - 1),
                    }))
                  }
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-lg font-medium">{selectedVariants.quantity}</span>
                <button
                  onClick={() =>
                    setSelectedVariants((prev) => ({
                      ...prev,
                      quantity: prev.quantity + 1,
                    }))
                  }
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowVariantDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                {language === "en" ? "Cancel" : "إلغاء"}
              </button>
              <button
                onClick={() => addToCart(selectedProduct, selectedVariants)}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                {t.addToCart}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Carousel */}
      {showImageCarousel && carouselProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowImageCarousel(false)}
              className="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
            >
              ×
            </button>

            <div className="relative">
              <img
                src={carouselProduct.images[currentImageIndex] || "/placeholder.svg"}
                alt={carouselProduct.name[language]}
                className="max-w-full max-h-[80vh] object-contain"
              />

              {carouselProduct.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Image indicators */}
            {carouselProduct.images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {carouselProduct.images.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-gray-500"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart/Checkout Dialog */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{t.cart}</h3>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-white text-2xl">
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                {language === "en" ? "Your cart is empty" : "سلتك فارغة"}
              </p>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.cartId} className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg">
                      <img
                        src={item.images?.[0] || "/placeholder.svg"}
                        alt={item.name[language]}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name[language]}</h4>
                        <p className="text-sm text-gray-400">
                          {item.selectedColor} • {item.selectedSize}
                        </p>
                        <p className="text-green-400 font-medium">
                          {t.shekel}
                          {item.price}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-md flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-md flex items-center justify-center"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-600 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold">
                    <span>{t.total}:</span>
                    <span className="text-green-400">
                      {t.shekel}
                      {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                    </span>
                  </div>
                </div>

                {/* Customer Info Form */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-medium">{t.customerDetails}</h4>
                  <input
                    type="text"
                    placeholder={t.fullName}
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="tel"
                    placeholder={t.phoneNumber}
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <textarea
                    placeholder={t.address}
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-medium transition-colors"
                >
                  {t.placeOrder}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
