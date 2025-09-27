'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AchievementStats as StatsType } from '@/types/achievement'
import { getAchievementStats } from '@/lib/achievementStorage'

export default function AchievementStats() {
  const [stats, setStats] = useState<StatsType>({
    currentStreak: 0,
    longestStreak: 0,
    totalTasksCompleted: 0,
    totalTasksCreated: 0,
    daysActive: 0,
    averageCompletionRate: 0
  })

  useEffect(() => {
    const loadStats = () => {
      const currentStats = getAchievementStats()
      setStats(currentStats)
    }
    
    loadStats()
    
    // Listen for storage changes to update stats in real-time
    const handleStorageChange = () => {
      loadStats()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const statCards = [
    {
      title: 'Current Streak',
      value: stats.currentStreak,
      unit: stats.currentStreak === 1 ? 'day' : 'days',
      icon: '🔥',
      color: 'from-orange-400 to-red-500',
      description: 'Days with 100% completion'
    },
    {
      title: 'Longest Streak',
      value: stats.longestStreak,
      unit: stats.longestStreak === 1 ? 'day' : 'days',
      icon: '🏆',
      color: 'from-yellow-400 to-orange-500',
      description: 'Best streak achieved'
    },
    {
      title: 'Tasks Completed',
      value: stats.totalTasksCompleted,
      unit: stats.totalTasksCompleted === 1 ? 'task' : 'tasks',
      icon: '✅',
      color: 'from-green-400 to-blue-500',
      description: 'Total tasks finished'
    },
    {
      title: 'Days Active',
      value: stats.daysActive,
      unit: stats.daysActive === 1 ? 'day' : 'days',
      icon: '📅',
      color: 'from-blue-400 to-purple-500',
      description: 'Days with recorded activity'
    },
    {
      title: 'Completion Rate',
      value: Math.round(stats.averageCompletionRate),
      unit: '%',
      icon: '📊',
      color: 'from-purple-400 to-pink-500',
      description: 'Average completion percentage'
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasksCreated,
      unit: stats.totalTasksCreated === 1 ? 'task' : 'tasks',
      icon: '📝',
      color: 'from-gray-400 to-gray-600',
      description: 'All tasks ever created'
    }
  ]

  return (
    <div className="garden-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Achievement Stats</h2>
        <span className="text-2xl">🏆</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="relative overflow-hidden rounded-lg bg-white border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.unit}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-700 text-sm">
                  {stat.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Motivational message */}
      {stats.currentStreak > 0 && (
        <motion.div
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-green-600">🔥</span>
            <p className="text-sm text-green-700">
              <span className="font-semibold">Amazing!</span> You're on a {stats.currentStreak}-day streak! 
              Keep it up to beat your record of {stats.longestStreak} days!
            </p>
          </div>
        </motion.div>
      )}
      
      {stats.currentStreak === 0 && stats.longestStreak > 0 && (
        <motion.div
          className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-orange-600">💪</span>
            <p className="text-sm text-orange-700">
              Complete all your tasks today to start a new streak! 
              Your best was {stats.longestStreak} days - you can do it again!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
