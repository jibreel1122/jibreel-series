"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Eye, Package, Clock, CheckCircle, Truck, Phone, MapPin, User, Calendar } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

const orderStatuses = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800", icon: Package },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Truck },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("adminAuth")
    if (authStatus !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      loadOrders()
    }
  }, [router])

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading orders:", error)
        return
      }

      if (data) {
        // Transform Supabase data to match component structure
        const transformedOrders = data.map((order: any) => ({
          id: order.id,
          customerInfo: {
            fullName: order.customer_name,
            phone: order.whatsapp_number,
            address: order.address,
          },
          items: order.items,
          total: order.total_amount,
          status: order.status,
          orderDate: order.created_at,
          language: "en", // Default language
        }))
        setOrders(transformedOrders)
      }
    } catch (error) {
      console.error("Error loading orders:", error)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

      if (error) {
        console.error("Error updating order status:", error)
        alert("Error updating order status. Please try again.")
        return
      }

      // Update local state
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      // Update selected order if it's the one being changed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Error updating order status. Please try again.")
    }
  }

  const getStatusInfo = (status: string) => {
    return orderStatuses.find((s) => s.value === status) || orderStatuses[0]
  }

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      totalRevenue: orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0),
    }
  }

  const stats = getOrderStats()

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
              <h1 className="text-2xl font-bold text-white">Order Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Processing</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Shipped</CardTitle>
              <Truck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Revenue</CardTitle>
              <div className="text-emerald-600 font-bold">₪</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">₪{stats.totalRevenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by order ID, customer name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">
                    All Orders
                  </SelectItem>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Order ID</TableHead>
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Items</TableHead>
                  <TableHead className="text-gray-300">Total</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status)
                  const StatusIcon = statusInfo.icon

                  return (
                    <TableRow key={order.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{order.customerInfo.fullName}</p>
                          <p className="text-sm text-gray-400">{order.customerInfo.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-300">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">₪{order.total}</TableCell>
                      <TableCell>
                        <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                          <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                            <div className="flex items-center">
                              <StatusIcon className="w-4 h-4 mr-2" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {orderStatuses.map((status) => {
                              const Icon = status.icon
                              return (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                  className="text-white hover:bg-gray-700"
                                >
                                  <div className="flex items-center">
                                    <Icon className="w-4 h-4 mr-2" />
                                    {status.label}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-300">
                          {new Date(order.orderDate).toLocaleDateString()}
                          <br />
                          <span className="text-gray-500">{new Date(order.orderDate).toLocaleTimeString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="border-gray-600 text-gray-200 hover:bg-gray-700"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-white">Order Details - {order.id}</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Customer Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Card className="bg-gray-700 border-gray-600">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-lg flex items-center text-white">
                                        <User className="w-5 h-5 mr-2 text-gray-400" />
                                        Customer Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="font-medium text-white">
                                          {selectedOrder.customerInfo.fullName}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="text-gray-300">{selectedOrder.customerInfo.phone}</span>
                                      </div>
                                      <div className="flex items-start">
                                        <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                                        <span className="text-sm text-gray-300">
                                          {selectedOrder.customerInfo.address}
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card className="bg-gray-700 border-gray-600">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-lg flex items-center text-white">
                                        <Package className="w-5 h-5 mr-2 text-gray-400" />
                                        Order Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{new Date(selectedOrder.orderDate).toLocaleString()}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <StatusIcon className="w-4 h-4 mr-2 text-gray-400" />
                                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="w-4 h-4 mr-2 text-gray-400">₪</span>
                                        <span className="font-bold text-emerald-600">₪{selectedOrder.total}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Order Items */}
                                <Card className="bg-gray-700 border-gray-600">
                                  <CardHeader>
                                    <CardTitle className="text-lg text-white">Order Items</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      {selectedOrder.items.map((item: any, index: number) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center p-3 border rounded bg-gray-800"
                                        >
                                          <div>
                                            <p className="font-medium text-white">
                                              {item.name[selectedOrder.language] || item.name.en}
                                            </p>
                                            <p className="text-sm text-gray-300">
                                              Quantity: {item.quantity} × ₪{item.price}
                                            </p>
                                          </div>
                                          <div className="font-bold text-emerald-600">
                                            ₪{item.price * item.quantity}
                                          </div>
                                        </div>
                                      ))}
                                      <div className="border-t pt-3 flex justify-between items-center font-bold text-lg text-white">
                                        <span>Total:</span>
                                        <span className="text-emerald-600">₪{selectedOrder.total}</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Status Update */}
                                <Card className="bg-gray-700 border-gray-600">
                                  <CardHeader>
                                    <CardTitle className="text-lg text-white">Update Order Status</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <Select
                                      value={selectedOrder.status}
                                      onValueChange={(value) => {
                                        handleStatusChange(selectedOrder.id, value)
                                        setSelectedOrder({ ...selectedOrder, status: value })
                                      }}
                                    >
                                      <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-800 border-gray-700">
                                        {orderStatuses.map((status) => {
                                          const Icon = status.icon
                                          return (
                                            <SelectItem
                                              key={status.value}
                                              value={status.value}
                                              className="text-white hover:bg-gray-700"
                                            >
                                              <div className="flex items-center">
                                                <Icon className="w-4 h-4 mr-2" />
                                                {status.label}
                                              </div>
                                            </SelectItem>
                                          )
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p>No orders found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
