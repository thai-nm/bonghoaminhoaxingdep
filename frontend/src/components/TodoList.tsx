'use client'

import { motion, AnimatePresence } from 'framer-motion'
import TodoItem from './TodoItem'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onEdit: (id: string, newText: string) => void
  onDeleteConfirm: (id: string, text: string) => void
}

export default function TodoList({ todos, onToggle, onEdit, onDeleteConfirm }: TodoListProps) {
  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  // If no todos, show minimal empty state
  if (totalCount === 0) {
    return (
      <div className="garden-card p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Today's Tasks
        </h3>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            No tasks yet. Add your first one below to get started!
          </p>
        </div>
      </div>
    )
  }

  // Sort todos: incomplete first, then by creation date
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="garden-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Today's Tasks
        </h3>
      </div>


      {/* Todo items */}
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {sortedTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDeleteConfirm={onDeleteConfirm}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer with encouragement */}
      {completedCount > 0 && completedCount < totalCount && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">🌿</span>
            <p className="text-sm text-green-700">
              Great progress! Keep going to see your garden bloom! 🌸
            </p>
          </div>
        </div>
      )}

      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">🌸</span>
            <p className="text-sm text-yellow-700">
              Amazing! Your garden is in full bloom! 🌸✨
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
