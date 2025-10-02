'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import TodoForm from '@/components/TodoForm'
import TodoList from '@/components/TodoList'
import TulipGrowth from '@/components/TulipGrowth'
import { 
  todoService, 
  createInitialLoadingState, 
  getErrorMessage 
} from '@/lib/todoService'
import { Todo, TodoLoadingState, TodoError, DailyRecord } from '@/types/todo'

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [dailyRecord, setDailyRecord] = useState<DailyRecord | null>(null)
  const [loadingState, setLoadingState] = useState<TodoLoadingState>(createInitialLoadingState())
  const [error, setError] = useState<TodoError | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; text: string } | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Fetch todos when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchTodos()
    }
  }, [isAuthenticated, isLoading])

  const fetchTodos = async () => {
    setLoadingState(prev => ({ ...prev, isLoading: true }))
    setError(null)
    
    try {
      const result = await todoService.fetchTodos()
      setTodos(result.todos)
      setDailyRecord(result.dailyRecord)
    } catch (err) {
      setError(err as TodoError)
    } finally {
      setLoadingState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleAddTodo = async (text: string) => {
    setLoadingState(prev => ({ ...prev, isCreating: true }))
    setError(null)
    
    try {
      const newTodo = await todoService.createTodo(text)
      setTodos(prev => [...prev, newTodo])
      // Refresh to get updated daily record stats
      await fetchTodos()
    } catch (err) {
      setError(err as TodoError)
    } finally {
      setLoadingState(prev => ({ ...prev, isCreating: false }))
    }
  }

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    setLoadingState(prev => ({ ...prev, isUpdating: id }))
    setError(null)
    
    // Optimistic update
    const newCompleted = !todo.completed
    setTodos(prev => 
      prev.map(t => 
        t.id === id ? { ...t, completed: newCompleted } : t
      )
    )
    
    try {
      const updatedTodo = await todoService.toggleTodoCompletion(id, newCompleted)
      setTodos(prev => 
        prev.map(t => t.id === id ? updatedTodo : t)
      )
      // Refresh to get updated daily record stats
      await fetchTodos()
    } catch (err) {
      // Rollback optimistic update
      setTodos(prev => 
        prev.map(t => 
          t.id === id ? { ...t, completed: todo.completed } : t
        )
      )
      setError(err as TodoError)
    } finally {
      setLoadingState(prev => ({ ...prev, isUpdating: null }))
    }
  }

  const handleEditTodo = async (id: string, newText: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo || newText.trim() === '') return

    setLoadingState(prev => ({ ...prev, isUpdating: id }))
    setError(null)
    
    // Optimistic update
    const oldText = todo.text
    setTodos(prev => 
      prev.map(t => 
        t.id === id ? { ...t, text: newText } : t
      )
    )
    
    try {
      const updatedTodo = await todoService.updateTodoText(id, newText)
      setTodos(prev => 
        prev.map(t => t.id === id ? updatedTodo : t)
      )
    } catch (err) {
      // Rollback optimistic update
      setTodos(prev => 
        prev.map(t => 
          t.id === id ? { ...t, text: oldText } : t
        )
      )
      setError(err as TodoError)
    } finally {
      setLoadingState(prev => ({ ...prev, isUpdating: null }))
    }
  }

  const handleDeleteTodo = async (id: string) => {
    setLoadingState(prev => ({ ...prev, isDeleting: id }))
    setError(null)
    
    // Optimistic update
    const todoToDelete = todos.find(t => t.id === id)
    setTodos(prev => prev.filter(t => t.id !== id))
    setDeleteConfirm(null)
    
    try {
      await todoService.deleteTodo(id)
      // Refresh to get updated daily record stats
      await fetchTodos()
    } catch (err) {
      // Rollback optimistic update
      if (todoToDelete) {
        setTodos(prev => [...prev, todoToDelete].sort((a, b) => 
          a.createdAt.getTime() - b.createdAt.getTime()
        ))
      }
      setError(err as TodoError)
    } finally {
      setLoadingState(prev => ({ ...prev, isDeleting: null }))
    }
  }

  const handleDeleteConfirm = (id: string, text: string) => {
    setDeleteConfirm({ id, text })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
  }

  const handleReset = async () => {
    setLoadingState(prev => ({ ...prev, isResetting: true }))
    setError(null)
    
    // Optimistic update
    const oldTodos = [...todos]
    setTodos([])
    setShowResetConfirm(false)
    
    try {
      await todoService.resetTodos()
      // Refresh to get updated data
      await fetchTodos()
    } catch (err) {
      // Rollback optimistic update
      setTodos(oldTodos)
      setError(err as TodoError)
    } finally {
      setLoadingState(prev => ({ ...prev, isResetting: false }))
    }
  }

  const handleResetCancel = () => {
    setShowResetConfirm(false)
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0


  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="garden-card p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show welcome message for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="space-y-8">
        <div className="garden-card p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Todo Garden! 🌱
          </h2>
          <p className="text-gray-600 mb-6">
            Transform your daily tasks into a beautiful growing garden. 
            Every completed task helps your digital garden bloom.
          </p>
          
          <div className="flex justify-center">
            <motion.div 
              className="text-6xl"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                duration: 0.6 
              }}
            >
              🌱
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Show todo functionality for authenticated users
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="garden-card p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome back, {user?.username}! 🌱
        </h2>
        <p className="text-gray-600 mb-6">
          Ready to grow your garden today? Add some todos and watch your productivity bloom!
        </p>
        
        {/* Tulip Growth Visualization */}
        {totalCount > 0 && (
          <div className="mb-6">
            <TulipGrowth 
              completedCount={completedCount} 
              totalCount={totalCount} 
            />
          </div>
        )}
        
        {totalCount === 0 && (
          <p className="text-sm text-gray-500">
            Start by adding your first todo to see your garden grow!
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          {/* Achievements Link */}
          <a
            href="/achievements"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
          >
            <span>🏆</span>
            <span>View Achievements</span>
          </a>
          
          {/* Reset Button */}
          {totalCount > 0 && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
            >
              🌱 Start Fresh
            </button>
          )}
        </div>
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
