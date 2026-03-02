import React, { useState } from "react";

const projects = [
    { id: 1, name: "Project Apollo", client: "Zenith Corp", team: 8, progress: 75, status: "In Progress", priority: "High", deadline: "Mar 15, 2026", sprint: "Sprint 14", tasks: { total: 48, done: 36 } },
    { id: 2, name: "Mercury CRM", client: "ByteFlow Inc", team: 5, progress: 90, status: "UAT", priority: "Medium", deadline: "Feb 28, 2026", sprint: "Sprint 12", tasks: { total: 32, done: 29 } },
    { id: 3, name: "Orion ERP", client: "Nova Systems", team: 12, progress: 40, status: "In Progress", priority: "Critical", deadline: "Jun 30, 2026", sprint: "Sprint 6", tasks: { total: 120, done: 48 } },
    { id: 4, name: "Titan Portal", client: "CloudNine", team: 10, progress: 55, status: "In Progress", priority: "High", deadline: "Apr 20, 2026", sprint: "Sprint 9", tasks: { total: 64, done: 35 } },
];

const ManagerProjectsPage = () => {
    const [search, setSearch] = useState("");
    const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div><h1 className="text-xl font-bold text-gray-900">My Projects</h1><p className="text-sm text-gray-500 mt-1">Track projects assigned to you</p></div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">+ Create Task</button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[{ label: "My Projects", value: "4" }, { label: "In Progress", value: "3" }, { label: "Total Tasks", value: "264" }, { label: "At Risk", value: "1" }].map((s, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map(p => (
                    <div key={p.id} className="bg-white border border-gray-200 rounded p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div><h3 className="text-base font-semibold text-gray-900">{p.name}</h3><p className="text-xs text-gray-500">{p.client} · {p.sprint}</p></div>
                            <div className="flex gap-1">
                                <span className={`text-xs px-2 py-0.5 rounded ${p.priority === "Critical" ? "bg-red-100 text-red-700" : p.priority === "High" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{p.priority}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${p.status === "In Progress" ? "bg-blue-100 text-blue-700" : p.status === "UAT" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>{p.status}</span>
                            </div>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 mb-3"><span>{p.team} members</span><span>Due: {p.deadline}</span></div>
                        <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Progress</span><span className="text-gray-700 font-medium">{p.progress}%</span></div>
                            <div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${p.progress}%` }} /></div>
                        </div>
                        <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">Tasks: {p.tasks.done}/{p.tasks.total} completed</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerProjectsPage;
