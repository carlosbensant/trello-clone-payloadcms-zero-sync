import React from 'react'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Metadata } from 'next'

import { AuthProvider } from '@/providers/auth-provider'
import { ZeroProvider } from '@/providers/zero-provider'

import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthGuard } from '@/providers/auth-provider/components/auth-guard'

import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mana',
  description: 'Real-time collaborative project management',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      {process.env.NODE_ENV === 'production' && (
        <>
          <Script
            strategy="lazyOnload"
            src="https://www.googletagmanager.com/gtag/js?id=G-WMEFSJ5X6Q"
          />
          <Script strategy="lazyOnload" id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-WMEFSJ5X6Q');
            `}
          </Script>
        </>
      )}
      <body className={`${inter.className} h-full`}>
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <AuthGuard>
                <ZeroProvider>
                  <div className="h-full flex flex-row">
                    <main className="w-full m-2 ml-0 rounded-[2px] overflow-y-scroll scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-300">
                      {children}
                    </main>
                  </div>
                </ZeroProvider>
              </AuthGuard>
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
