'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AchievementStats from '@/components/AchievementStats'
import DailyHistory from '@/components/DailyHistory'
import { generateDemoData, clearDemoData } from '@/lib/demoData'

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats')

  const tabs = [
    {
      id: 'stats' as const,
      label: 'Achievement Stats',
      icon: '🏆',
      description: 'View your overall progress and milestones'
    },
    {
      id: 'history' as const,
      label: 'Daily History',
      icon: '📅',
      description: 'Explore what you accomplished on specific days'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🌸 Your Garden Journey 🌸
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your productivity growth and celebrate your achievements. 
            Every completed task helps your digital garden bloom!
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-25'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-sm opacity-75">{tab.description}</div>
                </div>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Navigation and Demo Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-3 justify-between items-start"
        >
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Garden</span>
          </a>
          
          {/* Demo Data Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                generateDemoData()
                window.location.reload() // Refresh to show new data
              }}
              className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              <span>🎲</span>
              <span>Generate Demo Data</span>
            </button>
            <button
              onClick={() => {
                clearDemoData()
                window.location.reload() // Refresh to show cleared data
              }}
              className="inline-flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              <span>🗑️</span>
              <span>Clear Data</span>
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'stats' && <AchievementStats />}
          {activeTab === 'history' && <DailyHistory />}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="text-green-600">🌱</span>
            <span className="text-sm text-gray-600">
              Keep growing your productivity garden!
            </span>
            <span className="text-green-600">🌸</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
