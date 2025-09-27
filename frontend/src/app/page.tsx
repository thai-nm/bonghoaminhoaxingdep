'use client'

import { useState } from 'react'
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
          <div className="text-6xl animate-grow">
            {completionPercentage === 0 ? '🌱' :
             completionPercentage < 20 ? '🌱' :
             completionPercentage < 40 ? '🌿' :
             completionPercentage < 60 ? '🌳' :
             completionPercentage < 80 ? '🌲' : '🌸'}
          </div>
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
      </div>

      {/* Todo List */}
      <TodoList
        todos={todos}
        onToggle={handleToggleTodo}
        onEdit={handleEditTodo}
        onDelete={handleDeleteTodo}
      />

      {/* Add Todo Form */}
      <TodoForm onAddTodo={handleAddTodo} />
    </div>
  )
}

