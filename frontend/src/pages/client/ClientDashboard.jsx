import React, { useState, useEffect } from 'react'
import ClientSidebar from '../../components/layout/ClientSidebar'
import ClientTopbar from '../../components/layout/ClientTopbar'
import { Loader2, AlertCircle } from 'lucide-react'

const API = 'http://127.0.0.1:8000/api'

const statusColor = {
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  ON_HOLD: 'bg-yellow-100 text-yellow-700',
}

function Badge({ text }) {
  const cls = statusColor[text] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {text}
    </span>
  )
}

function Spinner() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-64 p-6">
      <Loader2 size={32} className="text-blue-500 animate-spin" />
    </div>
  )
}

function ErrBox({ msg }) {
  return (
    <div className="m-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
      <AlertCircle size={18} />
      {msg}
    </div>
  )
}

/* ================= DASHBOARD ================= */

function DashboardContent() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API}/client-projects/`)
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not connect to backend'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error) return <ErrBox msg={error} />

  const total = projects.length
  const active = projects.filter(p => p.status === 'ACTIVE').length
  const completed = projects.filter(p => p.status === 'COMPLETED').length
  const onHold = projects.filter(p => p.status === 'ON_HOLD').length

  const avgProgress = total
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / total)
    : 0

  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget || 0), 0)
  const totalSpent = projects.reduce((sum, p) => sum + Number(p.actual_cost || 0), 0)

  const activePercent = total ? (active / total) * 100 : 0
  const completedPercent = total ? (completed / total) * 100 : 0
  const onHoldPercent = total ? (onHold / total) * 100 : 0

  return (
    <div className="p-6 space-y-6">

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Projects</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-600">{active}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-2xl font-bold text-blue-600">{completed}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">On Hold</p>
          <p className="text-2xl font-bold text-yellow-600">{onHold}</p>
        </div>
      </div>

      {/* ===== AVG PROGRESS ===== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between mb-2 text-sm text-gray-500">
          <span>Average Project Progress</span>
          <span>{avgProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 h-4 rounded">
          <div
            className="bg-blue-500 h-4 rounded"
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>

      {/* ===== DISTRIBUTION ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Bar */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="font-semibold">Project Status Distribution</h3>

          <div>
            <p className="text-sm">Active ({active})</p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div className="bg-green-500 h-3 rounded"
                style={{ width: `${activePercent}%` }} />
            </div>
          </div>

          <div>
            <p className="text-sm">Completed ({completed})</p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div className="bg-blue-500 h-3 rounded"
                style={{ width: `${completedPercent}%` }} />
            </div>
          </div>

          <div>
            <p className="text-sm">On Hold ({onHold})</p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div className="bg-yellow-500 h-3 rounded"
                style={{ width: `${onHoldPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Pie */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <h3 className="font-semibold mb-4">Overview</h3>

          {total > 0 ? (
            <div
              className="w-40 h-40 rounded-full"
              style={{
                background: `conic-gradient(
                  #22c55e 0% ${activePercent}%,
                  #3b82f6 ${activePercent}% ${activePercent + completedPercent}%,
                  #eab308 ${activePercent + completedPercent}% 100%
                )`
              }}
            />
          ) : (
            <p className="text-gray-400">No Projects</p>
          )}

          <div className="mt-4 text-sm text-gray-600">
            <p>🟢 Active</p>
            <p>🔵 Completed</p>
            <p>🟡 On Hold</p>
          </div>
        </div>
      </div>

      {/* ===== BUDGET ===== */}
      <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-6">
        <div>
          <p className="text-gray-500 text-sm">Total Budget</p>
          <p className="text-xl font-bold">
            ${totalBudget.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Total Spent</p>
          <p className="text-xl font-bold">
            ${totalSpent.toLocaleString()}
          </p>
        </div>
      </div>

    </div>
  )
}

/* ================= ROOT ================= */

export default function ClientDashboard() {
  const [activePage, setActivePage] = useState('dashboard')

  return (
    <div className="flex min-h-screen">
      <ClientSidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 flex flex-col bg-gray-100">
        <ClientTopbar />
        <main className="flex-1">
          <DashboardContent />
        </main>
      </div>
    </div>
  )
}