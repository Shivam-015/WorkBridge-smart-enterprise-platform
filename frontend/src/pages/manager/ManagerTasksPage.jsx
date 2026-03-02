import React, { useState } from "react";

const tasks = [
    { id: 1, title: "Implement user authentication flow", project: "Project Apollo", assignee: "Riya Sharma", priority: "High", status: "In Progress", due: "Mar 05, 2026" },
    { id: 2, title: "Design dashboard wireframes", project: "Mercury CRM", assignee: "Priya Nair", priority: "Medium", status: "Completed", due: "Feb 28, 2026" },
    { id: 3, title: "Setup CI/CD pipeline", project: "Titan Portal", assignee: "Rahul Verma", priority: "High", status: "In Progress", due: "Mar 08, 2026" },
    { id: 4, title: "Database schema migration", project: "Orion ERP", assignee: "Vikram Singh", priority: "Critical", status: "Blocked", due: "Mar 03, 2026" },
    { id: 5, title: "API integration testing", project: "Project Apollo", assignee: "Ananya Das", priority: "Medium", status: "To Do", due: "Mar 10, 2026" },
    { id: 6, title: "Performance optimization", project: "Mercury CRM", assignee: "Karan Mehta", priority: "Low", status: "In Progress", due: "Mar 12, 2026" },
    { id: 7, title: "Write unit tests for auth module", project: "Project Apollo", assignee: "Riya Sharma", priority: "Medium", status: "To Do", due: "Mar 14, 2026" },
    { id: 8, title: "Deploy to staging environment", project: "Titan Portal", assignee: "Rahul Verma", priority: "High", status: "In Progress", due: "Mar 06, 2026" },
];

const ManagerTasksPage = () => {
    const [filter, setFilter] = useState("All");
    const statuses = ["All", "To Do", "In Progress", "Completed", "Blocked"];
    const filtered = filter === "All" ? tasks : tasks.filter(t => t.status === filter);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div><h1 className="text-xl font-bold text-gray-900">Tasks</h1><p className="text-sm text-gray-500 mt-1">Manage and assign tasks across your projects</p></div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">+ New Task</button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { label: "Total Tasks", value: tasks.length },
                    { label: "In Progress", value: tasks.filter(t => t.status === "In Progress").length },
                    { label: "Completed", value: tasks.filter(t => t.status === "Completed").length },
                    { label: "Blocked", value: tasks.filter(t => t.status === "Blocked").length },
                ].map((s, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                {statuses.map(s => (
                    <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-sm rounded ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}>{s}</button>
                ))}
            </div>

            <div className="space-y-2">
                {filtered.map(task => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded p-3 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                            <p className="text-xs text-gray-500">{task.project} · {task.assignee} · Due: {task.due}</p>
                        </div>
                        <div className="flex gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${task.priority === "Critical" ? "bg-red-100 text-red-700" : task.priority === "High" ? "bg-yellow-100 text-yellow-700" : task.priority === "Medium" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{task.priority}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${task.status === "In Progress" ? "bg-blue-100 text-blue-700" : task.status === "Completed" ? "bg-green-100 text-green-700" : task.status === "Blocked" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>{task.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerTasksPage;
