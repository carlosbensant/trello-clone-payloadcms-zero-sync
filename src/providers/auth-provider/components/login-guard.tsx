'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/providers/auth-provider'

interface LoginGuardProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export function LoginGuard({ children, redirectTo, fallback }: LoginGuardProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    console.log('LoginGuard - Auth state:', { user: !!user, loading, redirectTo })

    // Redirect authenticated users away from auth pages
    if (!loading && user && !hasRedirected) {
      console.log('LoginGuard - User authenticated...')

      // If a specific redirectTo is provided, use it
      if (redirectTo) {
        console.log('LoginGuard - Redirecting to specified path:', redirectTo)
        setHasRedirected(true)
        router.push(redirectTo)
        return
      }
    }
  }, [user, loading, redirectTo, hasRedirected])

  // Show loading state while checking auth
  if (loading) {
    console.log('LoginGuard - Showing loading state')
    return (
      fallback || (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #374151',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto',
              }}
            />
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
              Checking authentication...
            </div>
          </div>
        </div>
      )
    )
  }

  // Show nothing while redirecting authenticated users
  if (user) {
    console.log('LoginGuard - User authenticated, showing loading while redirecting')
    return (
      fallback || (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #374151',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto',
              }}
            />
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
              Redirecting to home...
            </div>
          </div>
        </div>
      )
    )
  }

  console.log('LoginGuard - No user, showing auth pages')
  // User is not authenticated, show auth pages
  return <>{children}</>
}
