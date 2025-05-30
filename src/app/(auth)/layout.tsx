import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { LoginGuard } from '@/providers/auth-provider/components/login-guard'

import { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'

import '@/styles/globals.css'

import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mana',
  description: 'Real-time collaborative project management',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
      <body>
        <main>
          <TooltipProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                <LoginGuard>
                  <div className="bg-background">
                    <main className="h-full">{children}</main>
                  </div>
                </LoginGuard>
              </AuthProvider>
              <Toaster />
            </ThemeProvider>
          </TooltipProvider>
        </main>
      </body>
    </html>
  )
}
