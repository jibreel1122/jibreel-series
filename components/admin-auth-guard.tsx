"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuth")
      const adminEmail = localStorage.getItem("adminEmail")

      if (authStatus === "true" && adminEmail === "jibreelebornat@gmail.com") {
        setIsAuthenticated(true)
      } else {
        // Clear any invalid auth data
        localStorage.removeItem("adminAuth")
        localStorage.removeItem("adminEmail")
        localStorage.removeItem("adminLoginTime")
        router.push("/admin/login")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-white">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <div className="min-h-screen bg-gray-900">{children}</div>
}
