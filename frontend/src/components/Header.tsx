'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'

export default function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // Debug logging
  console.log('Header - Auth state:', { user, isAuthenticated, isLoading })

  const handleLoginClick = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const handleRegisterClick = () => {
    setAuthMode('register')
    setShowAuthModal(true)
  }

  const handleLogout = () => {
    logout()
  }

  if (isLoading) {
    return (
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🌱 Todo Garden
              </h1>
              <p className="text-gray-600 mt-2">
                Watch your productivity bloom
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🌱 Todo Garden
              </h1>
              <p className="text-gray-600 mt-2">
                Watch your productivity bloom
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="text-sm text-gray-600">
                    Welcome, <span className="font-medium text-gray-800">{user?.username}</span>!
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  )
}
