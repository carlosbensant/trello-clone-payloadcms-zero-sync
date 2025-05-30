'use client'

import React from 'react'
import { Zero } from '@rocicorp/zero'
import { ZeroProvider as BaseZeroProvider } from '@rocicorp/zero/react'
import { schema, type Schema } from '../../zero/schema'
import { useAuth } from '@/providers/auth-provider'

interface ZeroProviderProps {
  children: React.ReactNode
}

export const ZeroProvider: React.FC<ZeroProviderProps> = ({ children }) => {
  const { user, token, loading } = useAuth()

  if (loading || !user || !token) {
    return <>{children}</>
  }

  const zero = new Zero<Schema>({
    auth: token,
    userID: user.id,
    server: 'http://localhost:4848',
    schema,
  })

  return <BaseZeroProvider zero={zero}>{children}</BaseZeroProvider>
}
