export default function HomePage() {
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
        
        {/* Growth Visualization Placeholder */}
        <div className="flex justify-center mb-6">
          <div className="text-6xl animate-grow">
            🌱
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Start by adding your first todo to see your garden grow!
        </p>
      </div>

      {/* Todo Section Placeholder */}
      <div className="garden-card p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Today's Tasks
        </h3>
        <div className="space-y-3">
          <div className="todo-item">
            <div className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-gray-700">Add your first todo here</span>
            </div>
          </div>
          <div className="todo-item">
            <div className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-gray-700">Watch your garden grow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Todo Form Placeholder */}
      <div className="garden-card p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Add New Task
        </h3>
        <div className="flex space-x-3">
          <input 
            type="text" 
            placeholder="What do you want to accomplish today?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Add Task
          </button>
        </div>
      </div>
    </div>
  )
}
