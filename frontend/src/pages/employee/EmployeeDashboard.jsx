import React, { useState, useEffect } from "react"
import EmployeeSidebar from "../../components/layout/EmployeeSidebar"
import EmployeeTopbar from "../../components/layout/EmployeeTopbar"

const API = "http://127.0.0.1:8000/api"

// ================= DASHBOARD PAGE =================
function DashboardContent() {
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])

    useEffect(() => {
        fetch(`${API}/tasks/`)
            .then(res => res.json())
            .then(data => setTasks(data))

        fetch(`${API}/projects/`)
            .then(res => res.json())
            .then(data => setProjects(data))
    }, [])

    // ===== TASK STATS =====
    const total = tasks.length
    const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length
    const done = tasks.filter(t => t.status === "DONE").length
    const todo = tasks.filter(t => t.status === "TODO").length

    const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0
    const donePercent = total > 0 ? (done / total) * 100 : 0
    const todoPercent = total > 0 ? (todo / total) * 100 : 0

    return (
        <div className="p-6 space-y-6">

            {/* ===== TOP STATS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-gray-500 text-sm">Tasks In Progress</h3>
                    <p className="text-2xl font-bold">{inProgress}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-gray-500 text-sm">Completed Tasks</h3>
                    <p className="text-2xl font-bold">{done}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-gray-500 text-sm">Total Projects</h3>
                    <p className="text-2xl font-bold">{projects.length}</p>
                </div>
            </div>

            {/* ===== GRAPH SECTION ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* BAR GRAPH */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold mb-4">Task Distribution</h3>

                    <div className="space-y-4">

                        <div>
                            <p className="text-sm">In Progress ({inProgress})</p>
                            <div className="w-full bg-gray-200 h-4 rounded">
                                <div
                                    className="bg-blue-500 h-4 rounded"
                                    style={{ width: `${inProgressPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm">Done ({done})</p>
                            <div className="w-full bg-gray-200 h-4 rounded">
                                <div
                                    className="bg-green-500 h-4 rounded"
                                    style={{ width: `${donePercent}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm">To Do ({todo})</p>
                            <div className="w-full bg-gray-200 h-4 rounded">
                                <div
                                    className="bg-gray-500 h-4 rounded"
                                    style={{ width: `${todoPercent}%` }}
                                ></div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* PIE CHART */}
                <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
                    <h3 className="font-semibold mb-4">Task Overview</h3>

                    {total > 0 ? (
                        <div
                            className="w-40 h-40 rounded-full"
                            style={{
                                background: `conic-gradient(
                                    #3b82f6 0% ${inProgressPercent}%,
                                    #22c55e ${inProgressPercent}% ${inProgressPercent + donePercent}%,
                                    #6b7280 ${inProgressPercent + donePercent}% 100%
                                )`
                            }}
                        ></div>
                    ) : (
                        <p className="text-gray-400">No Tasks Available</p>
                    )}

                    <div className="mt-4 text-sm text-gray-600">
                        <p>🔵 In Progress</p>
                        <p>🟢 Done</p>
                        <p>⚫ To Do</p>
                    </div>
                </div>

            </div>

        </div>
    )
}

// ================= TASKS PAGE =================
function TasksPage() {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        fetch(`${API}/tasks/`)
            .then(res => res.json())
            .then(data => setTasks(data))
    }, [])

    return (
        <div className="p-6 space-y-4">
            <h2 className="font-bold text-lg">My Tasks</h2>

            {tasks.map(task => (
                <div key={task.id} className="bg-white p-5 rounded-xl shadow">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <p className="text-sm mt-2">Status: {task.status}</p>
                    <p className="text-sm">Priority: {task.priority}</p>
                    <p className="text-sm">Due: {task.due_date}</p>
                </div>
            ))}
        </div>
    )
}

// ================= PROJECTS PAGE =================
function ProjectsPage() {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        fetch(`${API}/projects/`)
            .then(res => res.json())
            .then(data => setProjects(data))
    }, [])

    return (
        <div className="p-6 space-y-4">
            <h2 className="font-bold text-lg">My Projects</h2>

            {projects.map(project => (
                <div key={project.id} className="bg-white p-5 rounded-xl shadow">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                    <p className="text-sm mt-2">Status: {project.status}</p>
                    <p className="text-sm">Progress: {project.progress_percentage}%</p>
                    <p className="text-sm">Start: {project.start_date}</p>
                    <p className="text-sm">End: {project.end_date}</p>
                </div>
            ))}
        </div>
    )
}

// ================= ATTENDANCE PAGE =================
function AttendancePage() {
    const [message, setMessage] = useState("")

    const checkIn = async () => {
        const res = await fetch(`${API}/attendance/checkin/`, {
            method: "POST",
        })
        const data = await res.json()
        setMessage(data.message || "Checked In")
    }

    const checkOut = async () => {
        const res = await fetch(`${API}/attendance/checkout/`, {
            method: "POST",
        })
        const data = await res.json()
        setMessage(data.message || "Checked Out")
    }

    return (
        <div className="p-6 space-y-4">
            <h2 className="font-bold text-lg">Attendance</h2>

            <div className="flex gap-4">
                <button onClick={checkIn} className="bg-green-500 text-white px-4 py-2 rounded">
                    Check In
                </button>
                <button onClick={checkOut} className="bg-red-500 text-white px-4 py-2 rounded">
                    Check Out
                </button>
            </div>

            {message && <p className="text-sm mt-2">{message}</p>}
        </div>
    )
}

// ================= LEAVE PAGE =================
function LeavePage() {
    const [leaves, setLeaves] = useState([])
    const [form, setForm] = useState({
        start_date: "",
        end_date: "",
        reason: "",
    })

    useEffect(() => {
        fetch(`${API}/my-leaves/`)
            .then(res => res.json())
            .then(data => setLeaves(data))
    }, [])

    const applyLeave = async () => {
        const res = await fetch(`${API}/leave/apply/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })

        const data = await res.json()

        setLeaves([...leaves, data])
        setForm({ start_date: "", end_date: "", reason: "" })
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="font-bold text-lg">Apply Leave</h2>

            <div className="bg-white p-5 rounded-xl shadow space-y-3">
                <input
                    type="date"
                    value={form.start_date}
                    onChange={e => setForm({ ...form, start_date: e.target.value })}
                    className="border p-2 w-full"
                />
                <input
                    type="date"
                    value={form.end_date}
                    onChange={e => setForm({ ...form, end_date: e.target.value })}
                    className="border p-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Reason"
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                    className="border p-2 w-full"
                />

                <button
                    onClick={applyLeave}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Apply
                </button>
            </div>

            <h2 className="font-bold text-lg">My Leaves</h2>

            {leaves.map(leave => (
                <div key={leave.id} className="bg-white p-4 rounded shadow">
                    <p>{leave.reason}</p>
                    <p className="text-sm text-gray-500">
                        {leave.start_date} → {leave.end_date}
                    </p>
                    <p className="text-sm">Status: {leave.status}</p>
                </div>
            ))}
        </div>
    )
}

// ================= EXTRA PAGES =================

function ReportsPage() {
    return (
        <div className="p-6">
            <h2 className="text-lg font-bold">Reports</h2>
            <p className="text-gray-500 mt-2">
                Reports section coming soon...
            </p>
        </div>
    )
}

function SettingsPage() {
    return (
        <div className="p-6">
            <h2 className="text-lg font-bold">Settings</h2>
            <p className="text-gray-500 mt-2">
                Settings section coming soon...
            </p>
        </div>
    )
}

// ================= ROOT =================

export default function EmployeeDashboard() {
    const [activePage, setActivePage] = useState("dashboard")

    const renderPage = () => {
        switch (activePage) {
            case "tasks":
                return <TasksPage />
            case "projects":
                return <ProjectsPage />
            case "attendance":
                return <AttendancePage />
            case "leave":
                return <LeavePage />
            case "reports":
                return <ReportsPage />
            case "settings":
                return <SettingsPage />
            default:
                return <DashboardContent />
        }
    }

    return (
        <div className="flex min-h-screen">
            <EmployeeSidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <div className="flex-1 bg-gray-100 flex flex-col">
                <EmployeeTopbar />
                <main className="flex-1">
                    {renderPage()}
                </main>
            </div>
        </div>
    )
}