import React from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  ClipboardCheck,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'

const page1Items = [
  { label: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { label: 'My Tasks', icon: CheckSquare, key: 'tasks' },
  { label: 'My Projects', icon: FolderKanban, key: 'projects' },
]

const page2Items = [
  { label: 'Attendance', icon: ClipboardCheck, key: 'attendance' },
  { label: 'Leave', icon: CalendarDays, key: 'leave' },
]

const bottomItems = [
  { label: 'Reports', icon: BarChart3, key: 'reports' },
  { label: 'Settings', icon: Settings, key: 'settings' },
]

export default function EmployeeSidebar({ activePage, setActivePage }) {
  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}
    >
      <div className="px-6 py-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white font-semibold text-lg">WorkBridge</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2"></p>
          <div className="space-y-1">
            {page1Items.map(({ label, icon: Icon, key }) => (
              <button key={key} onClick={() => setActivePage(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${activePage === key ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <Icon size={18} />{label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2"></p>
          <div className="space-y-1">
            {page2Items.map(({ label, icon: Icon, key }) => (
              <button key={key} onClick={() => setActivePage(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${activePage === key ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <Icon size={18} />{label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">Other</p>
          <div className="space-y-1">
            {bottomItems.map(({ label, icon: Icon, key }) => (
              <button key={key} onClick={() => setActivePage(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${activePage === key ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <Icon size={18} />{label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-slate-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-150">
          <LogOut size={18} />Logout
        </button>
      </div>
    </aside>
  )
}
