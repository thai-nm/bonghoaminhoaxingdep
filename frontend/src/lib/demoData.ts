import { DailyRecord } from '@/types/achievement'
import { saveDailyRecord, saveAchievementStats } from './achievementStorage'

// Generate demo data for testing the achievement system
export const generateDemoData = (): void => {
  const today = new Date()
  const demoRecords: DailyRecord[] = []
  
  // Generate data for the last 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    
    // Create varied demo data
    const scenarios = [
      // Perfect days (100% completion)
      {
        todos: [
          { id: '1', text: 'Morning workout', completed: true },
          { id: '2', text: 'Review project proposal', completed: true },
          { id: '3', text: 'Call mom', completed: true },
          { id: '4', text: 'Grocery shopping', completed: true }
        ]
      },
      // Good days (75-90% completion)
      {
        todos: [
          { id: '1', text: 'Read 30 pages', completed: true },
          { id: '2', text: 'Team meeting prep', completed: true },
          { id: '3', text: 'Update resume', completed: true },
          { id: '4', text: 'Clean apartment', completed: false },
          { id: '5', text: 'Practice guitar', completed: true }
        ]
      },
      // Average days (50-70% completion)
      {
        todos: [
          { id: '1', text: 'Email responses', completed: true },
          { id: '2', text: 'Dentist appointment', completed: true },
          { id: '3', text: 'Finish report', completed: false },
          { id: '4', text: 'Meal prep', completed: false },
          { id: '5', text: 'Walk the dog', completed: true }
        ]
      },
      // Challenging days (20-40% completion)
      {
        todos: [
          { id: '1', text: 'Fix bug in code', completed: true },
          { id: '2', text: 'Organize files', completed: false },
          { id: '3', text: 'Plan weekend trip', completed: false },
          { id: '4', text: 'Learn new skill', completed: false },
          { id: '5', text: 'Water plants', completed: true }
        ]
      },
      // Light days (fewer tasks, high completion)
      {
        todos: [
          { id: '1', text: 'Morning meditation', completed: true },
          { id: '2', text: 'Quick grocery run', completed: true }
        ]
      }
    ]
    
    // Select scenario based on day pattern to create realistic streaks
    let scenarioIndex: number
    if (i <= 3) {
      // Recent days - mix of good and perfect
      scenarioIndex = Math.random() < 0.6 ? 0 : 1
    } else if (i <= 7) {
      // Week ago - varied performance
      scenarioIndex = Math.floor(Math.random() * scenarios.length)
    } else {
      // Older days - more varied
      scenarioIndex = Math.floor(Math.random() * scenarios.length)
    }
    
    const scenario = scenarios[scenarioIndex]
    const completedTasks = scenario.todos.filter(todo => todo.completed).length
    const totalTasks = scenario.todos.length
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100)
    
    const record: DailyRecord = {
      date: dateString,
      todos: scenario.todos.map(todo => ({
        ...todo,
        completedAt: todo.completed ? date : undefined
      })),
      totalTasks,
      completedTasks,
      completionPercentage
    }
    
    demoRecords.push(record)
    saveDailyRecord(record)
  }
  
  // Calculate and save demo stats
  const totalTasksCompleted = demoRecords.reduce((sum, record) => sum + record.completedTasks, 0)
  const totalTasksCreated = demoRecords.reduce((sum, record) => sum + record.totalTasks, 0)
  const daysActive = demoRecords.length
  const averageCompletionRate = (totalTasksCompleted / totalTasksCreated) * 100
  
  // Calculate streaks
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  
  // Check current streak (from today backwards)
  const sortedRecords = [...demoRecords].reverse() // Most recent first
  for (const record of sortedRecords) {
    if (record.completionPercentage === 100) {
      if (currentStreak === 0) currentStreak = tempStreak + 1
      tempStreak++
    } else {
      if (currentStreak === 0) break
      tempStreak = 0
    }
  }
  
  // Calculate longest streak
  tempStreak = 0
  for (const record of demoRecords) {
    if (record.completionPercentage === 100) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  }
  
  saveAchievementStats({
    currentStreak,
    longestStreak,
    totalTasksCompleted,
    totalTasksCreated,
    daysActive,
    averageCompletionRate
  })
  
  console.log('Demo data generated successfully!')
  console.log(`Generated ${demoRecords.length} days of data`)
  console.log(`Current streak: ${currentStreak} days`)
  console.log(`Longest streak: ${longestStreak} days`)
  console.log(`Total tasks completed: ${totalTasksCompleted}`)
}

// Clear all demo data
export const clearDemoData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('todo-garden-daily-records')
    localStorage.removeItem('todo-garden-achievement-stats')
    localStorage.removeItem('todo-garden-achievements')
    console.log('Demo data cleared!')
  }
}
