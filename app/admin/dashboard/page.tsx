"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Package, ShoppingCart, Users, TrendingUp, Settings, Store } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [loginTime, setLoginTime] = useState("")
  const [orderCount, setOrderCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth")
    const email = localStorage.getItem("adminEmail")
    const time = localStorage.getItem("adminLoginTime")

    if (authStatus === "true" && email === "jibreelebornat@gmail.com") {
      setIsAuthenticated(true)
      setAdminEmail(email)
      setLoginTime(time || "")

      const orders = JSON.parse(localStorage.getItem("jibreelOrders") || "[]")
      setOrderCount(orders.length + 3) // +3 for sample orders
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminEmail")
    localStorage.removeItem("adminLoginTime")
    router.push("/admin/login")
  }

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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Jibreel Series Admin</h1>
              <Badge variant="secondary" className="ml-3 bg-gray-700 text-gray-200">
                Dashboard
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-200 hover:bg-gray-700 bg-transparent"
                >
                  <Store className="w-4 h-4 mr-2" />
                  View Store
                </Button>
              </Link>
              <div className="text-sm text-gray-300">
                <p>Welcome, {adminEmail}</p>
                <p className="text-xs">Logged in: {loginTime ? new Date(loginTime).toLocaleString() : ""}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-200 hover:bg-gray-700 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to Admin Dashboard</h2>
          <p className="text-gray-300">
            Manage your Jibreel Series store, products, and orders from this central dashboard.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Total Products</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">6</div>
              <p className="text-xs text-gray-400">Sample products loaded</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{orderCount}</div>
              <p className="text-xs text-gray-400">
                {orderCount > 3 ? `${orderCount - 3} new orders` : "Sample orders"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Customers</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{orderCount}</div>
              <p className="text-xs text-gray-400">Unique customers</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₪3,693</div>
              <p className="text-xs text-gray-400">From completed orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gray-800 border-gray-700 hover:bg-gray-750">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Package className="w-5 h-5 mr-2 text-gray-400" />
                  Product Management
                </CardTitle>
                <CardDescription className="text-gray-300">Add, edit, and manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">Manage Products</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gray-800 border-gray-700 hover:bg-gray-750">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <ShoppingCart className="w-5 h-5 mr-2 text-gray-400" />
                  Order Management
                </CardTitle>
                <CardDescription className="text-gray-300">View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">View Orders</Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gray-800 border-gray-700 hover:bg-gray-750">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="w-5 h-5 mr-2 text-gray-400" />
                Store Settings
              </CardTitle>
              <CardDescription className="text-gray-300">Configure store settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">Settings</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-300">Latest updates and activities in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              <p>No recent activity to display</p>
              <p className="text-sm mt-2">Activity will appear here as customers interact with your store</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
