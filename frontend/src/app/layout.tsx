import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Todo Garden',
  description: 'Watch your productivity bloom - A unique to-do app with tree/flower growth visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold text-gray-800">
                🌱 Todo Garden
              </h1>
              <p className="text-gray-600 mt-2">
                Watch your productivity bloom
              </p>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}