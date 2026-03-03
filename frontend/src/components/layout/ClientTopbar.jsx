import React from 'react'
import { Bell } from 'lucide-react'

export default function ClientTopbar() {
  const name = "Client"
  const company = "Your Company"
  const initials = "CU"

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

      <div>
        <h1 className="text-xl font-bold text-gray-800">Client Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {name}!
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{name}</p>
            <p className="text-xs text-gray-400">{company}</p>
          </div>

          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
        </div>

      </div>
    </header>
  )
}