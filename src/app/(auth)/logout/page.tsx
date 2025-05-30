import React from 'react'

import { Gutter } from '@/components/gutter'
import { LogoutPage } from './LogoutPage'

export default async function Logout() {
  return (
    <Gutter>
      <LogoutPage />
    </Gutter>
  )
}
