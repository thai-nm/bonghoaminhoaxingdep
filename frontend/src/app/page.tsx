'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TodoForm from '@/components/TodoForm'
import TodoList from '@/components/TodoList'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; text: string } | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleAddTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date()
    }
    setTodos(prev => [...prev, newTodo])
  }

  const handleToggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const handleEditTodo = (id: string, newText: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, text: newText } : todo
      )
    )
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
    setDeleteConfirm(null)
  }

  const handleDeleteConfirm = (id: string, text: string) => {
    setDeleteConfirm({ id, text })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
  }

  const handleReset = () => {
    setTodos([])
    setShowResetConfirm(false)
  }

  const handleResetCancel = () => {
    setShowResetConfirm(false)
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="garden-card p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to Todo Garden!
        </h2>
        <p className="text-gray-600 mb-6">
          Transform your daily tasks into a beautiful growing garden. 
          Every completed task helps your digital garden bloom.
        </p>
        
        {/* Growth Visualization */}
        <div className="flex justify-center mb-6">
          <motion.div 
            className="text-6xl"
            key={completionPercentage}
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              duration: 0.6 
            }}
          >
            {completionPercentage === 0 ? '🌱' :
             completionPercentage < 20 ? '🌱' :
             completionPercentage < 40 ? '🌿' :
             completionPercentage < 60 ? '🌳' :
             completionPercentage < 80 ? '🌲' : '🌸'}
          </motion.div>
        </div>
        
        {totalCount > 0 && (
          <div className="text-sm text-gray-600">
            <p>Progress: {completedCount}/{totalCount} tasks completed</p>
            <p className="text-green-600 font-medium">
              {Math.round(completionPercentage)}% complete
            </p>
          </div>
        )}
        
        {totalCount === 0 && (
          <p className="text-sm text-gray-500">
            Start by adding your first todo to see your garden grow!
          </p>
        )}

        {totalCount > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
            >
              🌱 Start Fresh
            </button>
          </div>
        )}
      </div>

      {/* Todo List */}
      <TodoList
        todos={todos}
        onToggle={handleToggleTodo}
        onEdit={handleEditTodo}
        onDeleteConfirm={handleDeleteConfirm}
      />

      {/* Add Todo Form */}
      <TodoForm onAddTodo={handleAddTodo} />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Todo?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{deleteConfirm.text}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDeleteTodo(deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Start Fresh?
            </h3>
            <p className="text-gray-600 mb-4">
              This will clear all your todos and reset your garden. Are you sure you want to start fresh?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                🌱 Start Fresh
              </button>
              <button
                onClick={handleResetCancel}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

