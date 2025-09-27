'use client'

import { useState } from 'react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onEdit: (id: string, newText: string) => void
  onDeleteConfirm: (id: string, text: string) => void
}

export default function TodoItem({ todo, onToggle, onEdit, onDeleteConfirm }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    if (isEditing) {
      // Save the edit
      const trimmedText = editText.trim()
      if (trimmedText && trimmedText !== todo.text) {
        onEdit(todo.id, trimmedText)
      } else if (!trimmedText) {
        // If empty, cancel the edit
        setEditText(todo.text)
      }
    }
    setIsEditing(!isEditing)
  }

  const handleCancelEdit = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleDeleteClick = () => {
    onDeleteConfirm(todo.id, todo.text)
  }

  return (
    <div className="todo-item group">
      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200">
        {/* Checkbox */}
        <input 
          type="checkbox" 
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-4 h-4 text-green-600 rounded focus:ring-green-500 focus:ring-2"
        />
        
        {/* Todo Content */}
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleEdit}
              className="w-full px-2 py-1 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <span className={`text-gray-700 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.text}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit todo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete todo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}

        {/* Edit Mode Buttons */}
        {isEditing && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-1 text-green-600 hover:text-green-700 transition-colors"
              title="Save changes"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Cancel edit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
