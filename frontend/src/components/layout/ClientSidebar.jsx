import React from 'react'
import {
  LayoutDashboard,
  FolderOpen,
  ClipboardList,
  Settings,
  LogOut,
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { label: 'Projects Overview', icon: FolderOpen, key: 'projects' },
  { label: 'Task Status', icon: ClipboardList, key: 'tasks' },
  { label: 'Settings', icon: Settings, key: 'settings' },
]

export default function ClientSidebar({ activePage, setActivePage }) {
  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-white font-semibold text-lg">WorkBridge</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map(({ label, icon: Icon, key }) => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${activePage === key
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-150">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
