import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { InventoryProvider } from '@/context/InventoryContext'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tapicería Gaby - Cotizaciones',
  description: 'Aplicación para gestionar inventario y cotizaciones de trabajos de tapicería',
  manifest: '/manifest.json',
  themeColor: '#1f2937',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tapicería Gaby',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Tapicería Gaby',
    title: 'Tapicería Gaby - Cotizaciones',
    description: 'Aplicación para gestionar inventario y cotizaciones de trabajos de tapicería',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tapicería Gaby" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <InventoryProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
              <nav className="max-w-md mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                  <h1 className="text-lg font-semibold text-gray-900">
                    Tapicería Gaby
                  </h1>
                </div>
                    <div className="flex justify-around mt-3 space-x-1">
                      <Link 
                        href="/" 
                        className="flex-1 text-center py-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        Inicio
                      </Link>
                      <Link 
                        href="/inventory" 
                        className="flex-1 text-center py-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        Inventario
                      </Link>
                      <Link 
                        href="/quote" 
                        className="flex-1 text-center py-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        Cotización
                      </Link>
                    </div>
              </nav>
            </header>
            <main className="max-w-md mx-auto px-4 py-6">
              {children}
            </main>
          </div>
          <Toaster />
        </InventoryProvider>
      </body>
    </html>
  )
}
