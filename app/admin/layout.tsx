"use client"

import type React from "react"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return <AdminAuthGuard>{children}</AdminAuthGuard>
}
