import { DailyRecord, AchievementStats, Achievement } from '@/types/achievement'

const STORAGE_KEYS = {
  DAILY_RECORDS: 'todo-garden-daily-records',
  ACHIEVEMENT_STATS: 'todo-garden-achievement-stats',
  ACHIEVEMENTS: 'todo-garden-achievements'
}

// Helper function to get today's date in YYYY-MM-DD format
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0]
}

// Helper function to format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Daily Records Management
export const saveDailyRecord = (record: DailyRecord): void => {
  const records = getDailyRecords()
  records[record.date] = record
  localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records))
}

export const getDailyRecords = (): Record<string, DailyRecord> => {
  if (typeof window === 'undefined') return {}
  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS)
  return stored ? JSON.parse(stored) : {}
}

export const getDailyRecord = (date: string): DailyRecord | null => {
  const records = getDailyRecords()
  return records[date] || null
}

// Achievement Stats Management
export const saveAchievementStats = (stats: AchievementStats): void => {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENT_STATS, JSON.stringify(stats))
}

export const getAchievementStats = (): AchievementStats => {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalTasksCompleted: 0,
      totalTasksCreated: 0,
      daysActive: 0,
      averageCompletionRate: 0
    }
  }
  
  const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENT_STATS)
  if (stored) {
    return JSON.parse(stored)
  }
  
  // Calculate stats from daily records if not stored
  return calculateStatsFromRecords()
}

// Calculate stats from existing daily records
const calculateStatsFromRecords = (): AchievementStats => {
  const records = getDailyRecords()
  const recordValues = Object.values(records)
  
  if (recordValues.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalTasksCompleted: 0,
      totalTasksCreated: 0,
      daysActive: 0,
      averageCompletionRate: 0
    }
  }
  
  const totalTasksCompleted = recordValues.reduce((sum, record) => sum + record.completedTasks, 0)
  const totalTasksCreated = recordValues.reduce((sum, record) => sum + record.totalTasks, 0)
  const daysActive = recordValues.length
  const averageCompletionRate = totalTasksCreated > 0 ? (totalTasksCompleted / totalTasksCreated) * 100 : 0
  
  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(records)
  
  const stats: AchievementStats = {
    currentStreak,
    longestStreak,
    totalTasksCompleted,
    totalTasksCreated,
    daysActive,
    averageCompletionRate
  }
  
  saveAchievementStats(stats)
  return stats
}

// Calculate current and longest streaks
const calculateStreaks = (records: Record<string, DailyRecord>): { currentStreak: number; longestStreak: number } => {
  const sortedDates = Object.keys(records).sort()
  if (sortedDates.length === 0) return { currentStreak: 0, longestStreak: 0 }
  
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  
  // Check if today has 100% completion
  const today = getTodayString()
  const todayRecord = records[today]
  
  // Start from today and go backwards
  const todayIndex = sortedDates.indexOf(today)
  if (todayIndex !== -1 && todayRecord && todayRecord.completionPercentage === 100) {
    currentStreak = 1
    tempStreak = 1
    
    // Go backwards from yesterday
    for (let i = todayIndex - 1; i >= 0; i--) {
      const date = sortedDates[i]
      const record = records[date]
      
      if (record && record.completionPercentage === 100) {
        currentStreak++
        tempStreak++
      } else {
        break
      }
    }
  }
  
  // Calculate longest streak
  tempStreak = 0
  for (const date of sortedDates) {
    const record = records[date]
    if (record && record.completionPercentage === 100) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  }
  
  return { currentStreak, longestStreak }
}

// Update daily record with current todos
export const updateTodayRecord = (todos: any[]): void => {
  const today = getTodayString()
  const completedTasks = todos.filter(todo => todo.completed).length
  const totalTasks = todos.length
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  const record: DailyRecord = {
    date: today,
    todos: todos.map(todo => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      completedAt: todo.completed ? new Date() : undefined
    })),
    totalTasks,
    completedTasks,
    completionPercentage
  }
  
  saveDailyRecord(record)
  
  // Recalculate and save stats
  const stats = calculateStatsFromRecords()
  saveAchievementStats(stats)
}

// Get all dates with records for calendar/date picker
export const getAvailableDates = (): string[] => {
  const records = getDailyRecords()
  return Object.keys(records).sort().reverse() // Most recent first
}
