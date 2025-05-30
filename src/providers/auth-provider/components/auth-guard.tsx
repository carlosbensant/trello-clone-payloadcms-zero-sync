'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string // Custom redirect route
}

export function AuthGuard({ children, redirectTo }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect after loading is complete and we know there's no user
    if (!loading && !user) {
      const route = redirectTo || '/login'
      router.push(route)
    }
  }, [user, loading, redirectTo])

  // Show loading fallback while auth is loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!user) {
    return null
  }

  // User is authenticated, show children
  return <>{children}</>
}
