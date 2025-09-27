'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DailyRecord } from '@/types/achievement'
import { getDailyRecord, getAvailableDates, formatDate } from '@/lib/achievementStorage'

export default function DailyHistory() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [dailyRecord, setDailyRecord] = useState<DailyRecord | null>(null)
  const [availableDates, setAvailableDates] = useState<string[]>([])

  useEffect(() => {
    const dates = getAvailableDates()
    setAvailableDates(dates)
    
    // Auto-select today or most recent date
    if (dates.length > 0) {
      const today = new Date().toISOString().split('T')[0]
      const dateToSelect = dates.includes(today) ? today : dates[0]
      setSelectedDate(dateToSelect)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const record = getDailyRecord(selectedDate)
      setDailyRecord(record)
    }
  }, [selectedDate])

  const getCompletionColor = (percentage: number) => {
    if (percentage === 100) return 'text-green-600 bg-green-50 border-green-200'
    if (percentage >= 80) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (percentage >= 40) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getGrowthEmoji = (percentage: number) => {
    if (percentage === 0) return '🌱'
    if (percentage < 20) return '🌱'
    if (percentage < 40) return '🌿'
    if (percentage < 60) return '🌳'
    if (percentage < 80) return '🌲'
    return '🌸'
  }

  return (
    <div className="garden-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daily History</h2>
        <span className="text-2xl">📅</span>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select a date to view your accomplishments:
        </label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Choose a date...</option>
          {availableDates.map(date => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
        </select>
      </div>

      {/* Daily Record Display */}
      <AnimatePresence mode="wait">
        {dailyRecord ? (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <div className={`p-4 rounded-lg border ${getCompletionColor(dailyRecord.completionPercentage)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getGrowthEmoji(dailyRecord.completionPercentage)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {formatDate(dailyRecord.date)}
                    </h3>
                    <p className="text-sm opacity-75">
                      {dailyRecord.completedTasks} of {dailyRecord.totalTasks} tasks completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {dailyRecord.completionPercentage}%
                  </div>
                  <div className="text-sm opacity-75">
                    completion
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                <motion.div 
                  className="h-2 rounded-full bg-current opacity-60"
                  initial={{ width: 0 }}
                  animate={{ width: `${dailyRecord.completionPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                <span>📝</span>
                <span>Tasks from this day:</span>
              </h4>
              
              {dailyRecord.todos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl block mb-2">🌱</span>
                  <p>No tasks recorded for this day</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dailyRecord.todos.map((todo, index) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg border ${
                        todo.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        todo.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {todo.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      
                      <span className={`flex-1 ${
                        todo.completed 
                          ? 'text-green-700 line-through' 
                          : 'text-gray-700'
                      }`}>
                        {todo.text}
                      </span>
                      
                      {todo.completed && todo.completedAt && (
                        <span className="text-xs text-green-600">
                          ✓ Completed
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Achievement Message */}
            {dailyRecord.completionPercentage === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg border border-green-200"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">🎉</span>
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Perfect day!</span> You completed all your tasks and helped your garden bloom! 🌸
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : selectedDate ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            <span className="text-4xl block mb-2">📅</span>
            <p>No data found for {formatDate(selectedDate)}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            <span className="text-4xl block mb-2">🌱</span>
            <p>Select a date to view your daily accomplishments</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      {availableDates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>📊 You have records for {availableDates.length} {availableDates.length === 1 ? 'day' : 'days'}</span>
            <span>🗓️ Since {formatDate(availableDates[availableDates.length - 1])}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
