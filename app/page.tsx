"use client"

import { useState, useMemo, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export default function JibreelSeriesStore() {
  const [language, setLanguage] = useState<"en" | "ar">("en")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 })
  const [cart, setCart] = useState<any[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [addedToCart, setAddedToCart] = useState<number | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [theme, setTheme] = useState<"light" | "dark">("light")
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
    review: {
      rating: 5,
      comment: "",
      customerName: "",
    },
  })
  const [showImageCarousel, setShowImageCarousel] = useState(false)
  const [carouselProduct, setCarouselProduct] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [productReviews, setProductReviews] = useState<{ [key: number]: any[] }>({})

  const isRTL = language === "ar"

  useEffect(() => {
    const savedTheme = localStorage.getItem("jibreelTheme") as "light" | "dark"
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("jibreelTheme", newTheme)
  }

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
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      addReview: "Add Review (Optional)",
      reviews: "Reviews",
      noReviews: "No reviews yet",
      stars: "stars",
      writeReview: "Write a review",
      reviewPlaceholder: "Share your thoughts about this product...",
      namePlaceholder: "Your name (optional)",
      rating: "Rating",
      reviewComment: "Your Review",
      reviewerName: "Your Name",
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
      darkMode: "الوضع المظلم",
      lightMode: "الوضع المضيء",
      addReview: "إضافة تقييم (اختياري)",
      rating: "التقييم",
      reviewComment: "تقييمك",
      reviewerName: "اسمك",
      reviews: "التقييمات",
      noReviews: "لا توجد تقييمات بعد",
      stars: "نجوم",
      writeReview: "اكتب تقييماً",
      reviewPlaceholder: "شاركنا رأيك في هذا المنتج...",
      namePlaceholder: "اسمك (اختياري)",
    },
  }

  const t = translations[language]

  const themeClasses = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-900",
      header: "bg-white shadow-lg",
      headerText: "text-gray-900",
      card: "bg-white",
      cardText: "text-gray-900",
      cardBorder: "border-gray-200",
      input: "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
      button: "bg-blue-600 hover:bg-blue-700",
      secondaryButton: "bg-gray-200 hover:bg-gray-300 text-gray-900",
      accent: "text-blue-600",
      muted: "text-gray-600",
      hero: "bg-gradient-to-r from-blue-50 to-indigo-100",
      section: "bg-gray-100",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-white",
      header: "bg-gray-800 shadow-lg",
      headerText: "text-white",
      card: "bg-gray-800",
      cardText: "text-white",
      cardBorder: "border-gray-700",
      input: "bg-gray-700 border-gray-600 text-white placeholder-gray-400",
      button: "bg-green-600 hover:bg-green-700",
      secondaryButton: "bg-gray-700 hover:bg-gray-600 text-white",
      accent: "text-green-400",
      muted: "text-gray-300",
      hero: "bg-gradient-to-r from-gray-800 to-gray-900",
      section: "bg-gray-800",
    },
  }

  const currentTheme = themeClasses[theme]

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.en?.toLowerCase().includes(searchTerm.toLowerCase()) || product.name.ar?.includes(searchTerm)
      const matchesCategory =
        selectedCategory === "All" ||
        product.category.en === selectedCategory ||
        product.category.ar === selectedCategory
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [searchTerm, selectedCategory, priceRange, language, products])

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
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error loading products:", error)
          return
        }

        if (data && data.length > 0) {
          const transformedProducts = data.map((product: any) => ({
            id: product.id,
            name: { en: product.name, ar: product.name_ar },
            category: product.category || { en: "General", ar: "عام" },
            price: product.price,
            rating: product.rating,
            inStock: product.stock > 0,
            description: { en: product.description, ar: product.description_ar },
            images: product.images || ["/placeholder.svg"],
            colors: product.colors || ["Black", "White", "Navy"],
            sizes: product.sizes || ["S", "M", "L", "XL"],
            colorNames: availableColors.reduce(
              (acc, color) => {
                acc.en[color.name] = color.en
                acc.ar[color.name] = color.ar
                return acc
              },
              { en: {}, ar: {} } as any,
            ),
            sizeNames: {
              en: {
                ...sizeTranslations.en,
                ...availableSizes.numeric.reduce((acc, size) => ({ ...acc, [size]: size }), {}),
              },
              ar: {
                ...sizeTranslations.ar,
                ...availableSizes.numeric.reduce((acc, size) => ({ ...acc, [size]: size }), {}),
              },
            },
          }))
          setProducts(transformedProducts)
        } else {
          const sampleProducts = [
            {
              id: 1,
              name: { en: "Classic White Dress Shirt", ar: "قميص أبيض كلاسيكي" },
              category: { en: "Shirts", ar: "قمصان" },
              price: 299,
              rating: 4.6,
              inStock: true,
              description: { en: "Premium cotton dress shirt", ar: "قميص قطني فاخر" },
              images: ["/mens-white-dress-shirt.png", "/white-dress-shirt-front.png", "/white-dress-shirt-back.png"],
              colors: ["White", "Blue", "Gray", "Navy", "Black"],
              sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
              colorNames: availableColors.reduce(
                (acc, color) => {
                  acc.en[color.name] = color.en
                  acc.ar[color.name] = color.ar
                  return acc
                },
                { en: {}, ar: {} } as any,
              ),
              sizeNames: {
                en: sizeTranslations.en,
                ar: sizeTranslations.ar,
              },
            },
            {
              id: 2,
              name: { en: "Classic Blue Jeans", ar: "جينز أزرق كلاسيكي" },
              category: { en: "Jeans", ar: "جينز" },
              price: 450,
              rating: 4.6,
              inStock: true,
              description: { en: "Comfortable denim jeans", ar: "جينز دنيم مريح" },
              images: ["/mens-classic-blue-jeans.png", "/blue-jeans-side.png", "/blue-jeans-back-pocket.png"],
              colors: ["Blue", "Black", "Gray", "Navy"],
              sizes: ["28", "30", "32", "34", "36", "38", "40", "42"],
              colorNames: availableColors.reduce(
                (acc, color) => {
                  acc.en[color.name] = color.en
                  acc.ar[color.name] = color.ar
                  return acc
                },
                { en: {}, ar: {} } as any,
              ),
              sizeNames: {
                en: availableSizes.numeric.reduce((acc, size) => ({ ...acc, [size]: size }), {}),
                ar: availableSizes.numeric.reduce((acc, size) => ({ ...acc, [size]: size }), {}),
              },
            },
          ]
          setProducts(sampleProducts)
        }
      } catch (error) {
        console.error("Error loading products:", error)
      }
    }

    loadProducts()
  }, [])

  const loadProductReviews = async (productId: number) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading reviews:", error)
        return
      }

      setProductReviews((prev) => ({
        ...prev,
        [productId]: data || [],
      }))
    } catch (error) {
      console.error("Error loading reviews:", error)
    }
  }

  // ... existing functions ...

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
      review: {
        rating: 5,
        comment: "",
        customerName: "",
      },
    })
    setShowVariantDialog(true)

    // Load reviews for this product
    loadProductReviews(product.id)
  }

  const addToCart = async (product: any, variants: any) => {
    setAddingToCart(product.id)

    try {
      // Save review if provided
      if (variants.review.comment.trim() || variants.review.customerName.trim()) {
        const reviewData = {
          product_id: product.id,
          customer_name: variants.review.customerName.trim() || "Anonymous",
          rating: variants.review.rating,
          comment: variants.review.comment.trim(),
          language: language,
        }

        const { error: reviewError } = await supabase.from("reviews").insert([reviewData])

        if (reviewError) {
          console.error("Error saving review:", reviewError)
        } else {
          // Reload reviews for this product
          loadProductReviews(product.id)
        }
      }

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

        // Reset review form
        setSelectedVariants((prev) => ({
          ...prev,
          review: {
            rating: 5,
            comment: "",
            customerName: "",
          },
        }))

        setTimeout(() => setAddedToCart(null), 2000)
      }, 800)
    } catch (error) {
      console.error("Error adding to cart:", error)
      setAddingToCart(null)
    }
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

  const handleCheckout = async () => {
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
      alert(language === "en" ? "Please fill in all fields" : "يرجى ملء جميع الحقول")
      return
    }

    try {
      const order = {
        customer_name: customerInfo.fullName,
        whatsapp: customerInfo.phone, // Changed from whatsapp_number to whatsapp
        address: customerInfo.address,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), // Changed from total_amount to total
        status: "pending",
        language: language, // Added language field
      }

      const { error } = await supabase.from("orders").insert([order])

      if (error) {
        console.error("Error saving order:", error)
        alert(
          language === "en" ? "Error placing order. Please try again." : "خطأ في تأكيد الطلب. يرجى المحاولة مرة أخرى.",
        )
        return
      }

      setCart([])
      setCustomerInfo({ fullName: "", phone: "", address: "" })
      setShowCheckout(false)
      alert(t.orderPlaced)
    } catch (error) {
      console.error("Error placing order:", error)
      alert(
        language === "en" ? "Error placing order. Please try again." : "خطأ في تأكيد الطلب. يرجى المحاولة مرة أخرى.",
      )
    }
  }

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category[language])))]

  const availableColors = [
    { name: "Black", hex: "#000000", en: "Black", ar: "أسود" },
    { name: "White", hex: "#FFFFFF", en: "White", ar: "أبيض" },
    { name: "Navy", hex: "#1e3a8a", en: "Navy", ar: "كحلي" },
    { name: "Gray", hex: "#6b7280", en: "Gray", ar: "رمادي" },
    { name: "Brown", hex: "#92400e", en: "Brown", ar: "بني" },
    { name: "Beige", hex: "#d2b48c", en: "Beige", ar: "بيج" },
    { name: "Red", hex: "#dc2626", en: "Red", ar: "أحمر" },
    { name: "Blue", hex: "#2563eb", en: "Blue", ar: "أزرق" },
    { name: "Green", hex: "#16a34a", en: "Green", ar: "أخضر" },
    { name: "Purple", hex: "#9333ea", en: "Purple", ar: "بنفسجي" },
    { name: "Pink", hex: "#ec4899", en: "Pink", ar: "وردي" },
    { name: "Orange", hex: "#ea580c", en: "Orange", ar: "برتقالي" },
    { name: "Yellow", hex: "#eab308", en: "Yellow", ar: "أصفر" },
    { name: "Maroon", hex: "#7f1d1d", en: "Maroon", ar: "عنابي" },
    { name: "Olive", hex: "#65a30d", en: "Olive", ar: "زيتوني" },
    { name: "Teal", hex: "#0d9488", en: "Teal", ar: "أزرق مخضر" },
  ]

  const availableSizes = {
    clothing: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL"],
    numeric: [
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
    ],
  }

  const sizeTranslations = {
    en: {
      XS: "Extra Small",
      S: "Small",
      M: "Medium",
      L: "Large",
      XL: "Extra Large",
      "2XL": "2X Large",
      "3XL": "3X Large",
      "4XL": "4X Large",
      "5XL": "5X Large",
      "6XL": "6X Large",
      "7XL": "7X Large",
      "8XL": "8X Large",
    },
    ar: {
      XS: "صغير جداً",
      S: "صغير",
      M: "متوسط",
      L: "كبير",
      XL: "كبير جداً",
      "2XL": "كبير جداً 2",
      "3XL": "كبير جداً 3",
      "4XL": "كبير جداً 4",
      "5XL": "كبير جداً 5",
      "6XL": "كبير جداً 6",
      "7XL": "كبير جداً 7",
      "8XL": "كبير جداً 8",
    },
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} ${isRTL ? "rtl" : "ltr"}`}>
      {/* Header */}
      <header className={`${currentTheme.header} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className={`text-2xl font-bold ${currentTheme.headerText}`}>{t.title}</h1>
              <a
                href="/admin/login"
                className={`text-sm ${currentTheme.muted} hover:${currentTheme.accent} transition-colors`}
              >
                Admin
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 ${currentTheme.secondaryButton} rounded-md transition-colors`}
                title={theme === "light" ? t.darkMode : t.lightMode}
              >
                {theme === "light" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </button>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className={`px-3 py-1 ${currentTheme.secondaryButton} rounded-md text-sm transition-colors`}
              >
                {language === "en" ? "العربية" : "English"}
              </button>

              {/* Cart */}
              <button
                onClick={() => setShowCheckout(true)}
                className={`relative p-2 ${currentTheme.secondaryButton} rounded-md transition-colors`}
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
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
              >
                {t.contact}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`${currentTheme.hero} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">{t.title}</h2>
          <p className={`text-xl md:text-2xl ${currentTheme.muted} mb-8 animate-fade-in-delay`}>{t.subtitle}</p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className={`py-8 ${currentTheme.section}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-2 ${currentTheme.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <svg
                  className={`absolute right-3 top-2.5 w-5 h-5 ${currentTheme.muted}`}
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
                      selectedCategory === category ? `${currentTheme.button} text-white` : currentTheme.secondaryButton
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${currentTheme.text}`}>
                  {language === "ar" ? "نطاق السعر:" : "Price Range:"}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                    className={`w-20 px-2 py-1 text-sm ${currentTheme.input} rounded border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  <span className={currentTheme.muted}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 2000 })}
                    className={`w-20 px-2 py-1 text-sm ${currentTheme.input} rounded border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  <span className={`text-sm ${currentTheme.muted}`}>₪</span>
                </div>
              </div>
              <button
                onClick={() => setPriceRange({ min: 0, max: 2000 })}
                className={`px-3 py-1 text-sm rounded ${currentTheme.secondaryButton} hover:opacity-80`}
              >
                {language === "ar" ? "إعادة تعيين" : "Reset"}
              </button>
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
                className={`${currentTheme.card} ${currentTheme.cardBorder} border rounded-xl shadow-lg overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
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
                  <h4 className={`text-xl font-semibold mb-2 ${currentTheme.cardText}`}>{product.name[language]}</h4>
                  <p className={`${currentTheme.muted} text-sm mb-3`}>{product.description?.[language] || ""}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className={`text-sm ${currentTheme.muted} ml-1`}>{product.rating}</span>
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
                    <span className={`text-2xl font-bold ${currentTheme.accent}`}>
                      {t.shekel}
                      {product.price}
                    </span>

                    <button
                      onClick={() => handleAddToCartClick(product)}
                      disabled={!product.inStock || addingToCart === product.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        !product.inStock
                          ? `${currentTheme.secondaryButton} opacity-50 cursor-not-allowed`
                          : addingToCart === product.id
                            ? "bg-yellow-600 text-white"
                            : addedToCart === product.id
                              ? "bg-green-600 text-white"
                              : `${currentTheme.button} text-white hover:shadow-lg transform hover:scale-105`
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
          <div className={`${currentTheme.card} rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <h3 className={`text-xl font-bold mb-4 ${currentTheme.cardText}`}>{selectedProduct.name[language]}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Product Selection */}
              <div>
                {/* Color Selection */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${currentTheme.cardText}`}>
                    {language === "en" ? "Color" : "اللون"}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.colors?.map((colorName: string) => {
                      const colorInfo = availableColors.find((c) => c.name === colorName)
                      return (
                        <button
                          key={colorName}
                          onClick={() => setSelectedVariants((prev) => ({ ...prev, color: colorName }))}
                          className={`relative p-2 rounded-md border-2 transition-all ${
                            selectedVariants.color === colorName
                              ? "border-blue-500 shadow-lg"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full mx-auto mb-1 border"
                            style={{ backgroundColor: colorInfo?.hex || "#000000" }}
                          />
                          <span className={`text-xs ${currentTheme.cardText}`}>
                            {selectedProduct.colorNames?.[language]?.[colorName] || colorName}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${currentTheme.cardText}`}>
                    {language === "en" ? "Size" : "المقاس"}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.sizes?.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariants((prev) => ({ ...prev, size }))}
                        className={`px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedVariants.size === size
                            ? `${currentTheme.button} text-white`
                            : currentTheme.secondaryButton
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${currentTheme.cardText}`}>
                    {language === "en" ? "Quantity" : "الكمية"}
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setSelectedVariants((prev) => ({
                          ...prev,
                          quantity: Math.max(1, prev.quantity - 1),
                        }))
                      }
                      className={`w-8 h-8 ${currentTheme.secondaryButton} rounded-md flex items-center justify-center`}
                    >
                      -
                    </button>
                    <span className={`text-lg font-medium ${currentTheme.cardText}`}>{selectedVariants.quantity}</span>
                    <button
                      onClick={() =>
                        setSelectedVariants((prev) => ({
                          ...prev,
                          quantity: prev.quantity + 1,
                        }))
                      }
                      className={`w-8 h-8 ${currentTheme.secondaryButton} rounded-md flex items-center justify-center`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Review Section */}
              <div>
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${currentTheme.cardText}`}>{t.addReview}</label>

                  {/* Rating Selection */}
                  <div className="mb-3">
                    <label className={`block text-xs ${currentTheme.muted} mb-1`}>{t.rating}</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              review: { ...prev.review, rating: star },
                            }))
                          }
                          className={`text-2xl transition-colors ${
                            star <= selectedVariants.review.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reviewer Name */}
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder={t.namePlaceholder}
                      value={selectedVariants.review.customerName}
                      onChange={(e) =>
                        setSelectedVariants((prev) => ({
                          ...prev,
                          review: { ...prev.review, customerName: e.target.value },
                        }))
                      }
                      className={`w-full px-3 py-2 text-sm ${currentTheme.input} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Review Comment */}
                  <div className="mb-3">
                    <textarea
                      placeholder={t.reviewPlaceholder}
                      value={selectedVariants.review.comment}
                      onChange={(e) =>
                        setSelectedVariants((prev) => ({
                          ...prev,
                          review: { ...prev.review, comment: e.target.value },
                        }))
                      }
                      rows={3}
                      className={`w-full px-3 py-2 text-sm ${currentTheme.input} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                {/* Existing Reviews */}
                <div className="mb-4">
                  <h4 className={`text-sm font-medium mb-2 ${currentTheme.cardText}`}>
                    {t.reviews} ({productReviews[selectedProduct.id]?.length || 0})
                  </h4>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {productReviews[selectedProduct.id]?.length > 0 ? (
                      productReviews[selectedProduct.id].map((review: any) => (
                        <div key={review.id} className={`p-2 ${currentTheme.section} rounded-md`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-medium ${currentTheme.cardText}`}>
                              {review.customer_name}
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-xs ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          {review.comment && <p className={`text-xs ${currentTheme.muted}`}>{review.comment}</p>}
                        </div>
                      ))
                    ) : (
                      <p className={`text-xs ${currentTheme.muted} text-center py-2`}>{t.noReviews}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowVariantDialog(false)}
                className={`flex-1 px-4 py-2 ${currentTheme.secondaryButton} rounded-lg transition-colors`}
              >
                {language === "en" ? "Cancel" : "إلغاء"}
              </button>
              <button
                onClick={() => addToCart(selectedProduct, selectedVariants)}
                className={`flex-1 px-4 py-2 ${currentTheme.button} text-white rounded-lg transition-colors`}
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
          <div className={`${currentTheme.card} rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${currentTheme.cardText}`}>{t.cart}</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className={`${currentTheme.muted} hover:${currentTheme.cardText} text-2xl`}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p className={`text-center ${currentTheme.muted} py-8`}>
                {language === "en" ? "Your cart is empty" : "سلتك فارغة"}
              </p>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.cartId}
                      className={`flex items-center space-x-4 ${currentTheme.section} p-4 rounded-lg`}
                    >
                      <img
                        src={item.images?.[0] || "/placeholder.svg"}
                        alt={item.name[language]}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className={`font-medium ${currentTheme.cardText}`}>{item.name[language]}</h4>
                        <p className={`text-sm ${currentTheme.muted}`}>
                          {item.selectedColor} • {item.selectedSize}
                        </p>
                        <p className={`${currentTheme.accent} font-medium`}>
                          {t.shekel}
                          {item.price}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                          className={`w-8 h-8 ${currentTheme.secondaryButton} rounded-md flex items-center justify-center`}
                        >
                          -
                        </button>
                        <span className={`w-8 text-center ${currentTheme.cardText}`}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                          className={`w-8 h-8 ${currentTheme.secondaryButton} rounded-md flex items-center justify-center`}
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
                <div className={`border-t ${currentTheme.cardBorder} pt-4 mb-6`}>
                  <div className={`flex justify-between text-xl font-bold ${currentTheme.cardText}`}>
                    <span>{t.total}:</span>
                    <span className={currentTheme.accent}>
                      {t.shekel}
                      {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                    </span>
                  </div>
                </div>

                {/* Customer Info Form */}
                <div className="space-y-4 mb-6">
                  <h4 className={`text-lg font-medium ${currentTheme.cardText}`}>{t.customerDetails}</h4>
                  <input
                    type="text"
                    placeholder={t.fullName}
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, fullName: e.target.value }))}
                    className={`w-full px-4 py-2 ${currentTheme.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <input
                    type="tel"
                    placeholder={t.phoneNumber}
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-4 py-2 ${currentTheme.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <textarea
                    placeholder={t.address}
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className={`w-full px-4 py-2 ${currentTheme.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className={`w-full px-6 py-3 ${currentTheme.button} text-white rounded-lg text-lg font-medium transition-colors`}
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
