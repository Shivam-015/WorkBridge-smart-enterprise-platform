import React, { useState } from "react";

const teamMembers = [
    { id: 1, name: "Riya Sharma", role: "Frontend Developer", location: "Mumbai", status: "Active", rating: 4.8, tasksCompleted: 42, project: "Project Apollo" },
    { id: 2, name: "Vikram Singh", role: "Backend Developer", location: "Hyderabad", status: "Active", rating: 4.5, tasksCompleted: 38, project: "Orion ERP" },
    { id: 3, name: "Priya Nair", role: "UI/UX Designer", location: "Bangalore", status: "Active", rating: 4.9, tasksCompleted: 29, project: "Mercury CRM" },
    { id: 4, name: "Rahul Verma", role: "DevOps Engineer", location: "Pune", status: "Active", rating: 4.6, tasksCompleted: 35, project: "Titan Portal" },
    { id: 5, name: "Ananya Das", role: "QA Lead", location: "Kolkata", status: "On Leave", rating: 4.3, tasksCompleted: 31, project: "Project Apollo" },
    { id: 6, name: "Karan Mehta", role: "Data Analyst", location: "Mumbai", status: "Active", rating: 4.7, tasksCompleted: 22, project: "Orion ERP" },
];

const ManagerTeamPage = () => {
    const [search, setSearch] = useState("");
    const filtered = teamMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div><h1 className="text-xl font-bold text-gray-900">My Team</h1><p className="text-sm text-gray-500 mt-1">Manage your team members and performance</p></div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">+ Request Member</button>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[{ label: "Team Size", value: "6" }, { label: "Active Now", value: "5" }, { label: "Avg. Rating", value: "4.6" }].map((s, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
                ))}
            </div>

            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search team members..." className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(m => (
                    <div key={m.id} className="bg-white border border-gray-200 rounded p-4">
                        <div className="mb-3">
                            <h3 className="text-sm font-semibold text-gray-900">{m.name}</h3>
                            <p className="text-xs text-gray-500">{m.role}</p>
                            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${m.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{m.status}</span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1 mb-3">
                            <p>📍 {m.location}</p>
                            <p>📂 {m.project}</p>
                            <p>⭐ {m.rating} rating · {m.tasksCompleted} tasks done</p>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                            <button className="text-xs text-blue-600 hover:underline">View Profile</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerTeamPage;
