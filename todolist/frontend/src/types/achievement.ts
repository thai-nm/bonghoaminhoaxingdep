export interface DailyRecord {
  date: string // YYYY-MM-DD format
  todos: {
    id: string
    text: string
    completed: boolean
    completedAt?: Date
  }[]
  totalTasks: number
  completedTasks: number
  completionPercentage: number
}

export interface AchievementStats {
  currentStreak: number
  longestStreak: number
  totalTasksCompleted: number
  totalTasksCreated: number
  daysActive: number
  averageCompletionRate: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
  progress: number
  maxProgress: number
}
