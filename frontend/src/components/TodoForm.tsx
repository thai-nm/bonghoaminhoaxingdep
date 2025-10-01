'use client'

import { useState } from 'react'

interface TodoFormProps {
  onAddTodo: (text: string) => Promise<void>
}

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  const [inputValue, setInputValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Trim whitespace and check if empty
    const trimmedValue = inputValue.trim()
    if (!trimmedValue) {
      return // Don't add empty todos
    }

    setIsSubmitting(true)
    
    try {
      // Add the todo
      await onAddTodo(trimmedValue)
      
      // Clear the input
      setInputValue('')
    } catch (error) {
      console.error('Error adding todo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="garden-card p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Add New Task
      </h3>
      
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input 
          type="text" 
          value={inputValue}
          onChange={handleInputChange}
          placeholder="What do you want to accomplish today?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          disabled={isSubmitting}
        />
        <button 
          type="submit"
          disabled={!inputValue.trim() || isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <span>🌱</span>
              <span>Add Task</span>
            </>
          )}
        </button>
      </form>
      
      {inputValue.trim() && (
        <p className="text-sm text-gray-500 mt-2">
          Press Enter or click "Add Task" to plant this seed in your garden
        </p>
      )}
    </div>
  )
}
