import React, { useState } from "react";

const projects = [
    { id: 1, name: "Project Apollo", client: "Zenith Corp", pm: "Arjun Patel", team: 8, progress: 75, status: "In Progress", priority: "High", deadline: "Mar 15, 2026", budget: "$120K" },
    { id: 2, name: "Mercury CRM", client: "ByteFlow Inc", pm: "Priya Nair", team: 5, progress: 90, status: "UAT", priority: "Medium", deadline: "Feb 28, 2026", budget: "$85K" },
    { id: 3, name: "Orion ERP", client: "Nova Systems", pm: "Vikram Singh", team: 12, progress: 40, status: "In Progress", priority: "Critical", deadline: "Jun 30, 2026", budget: "$250K" },
    { id: 4, name: "Nebula Analytics", client: "DataPrime", pm: "Riya Sharma", team: 6, progress: 100, status: "Completed", priority: "Low", deadline: "Jan 10, 2026", budget: "$60K" },
    { id: 5, name: "Titan Portal", client: "CloudNine", pm: "Rahul Verma", team: 10, progress: 55, status: "In Progress", priority: "High", deadline: "Apr 20, 2026", budget: "$180K" },
    { id: 6, name: "Vega Dashboard", client: "InnoTech", pm: "Neha Gupta", team: 4, progress: 20, status: "Planning", priority: "Medium", deadline: "Jul 15, 2026", budget: "$45K" },
];

const ProjectsPage = () => {
    const [search, setSearch] = useState("");
    const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div><h1 className="text-xl font-bold text-gray-900">Projects</h1><p className="text-sm text-gray-500 mt-1">Track and manage all enterprise projects</p></div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">+ New Project</button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[{ label: "Total Projects", value: "36" }, { label: "In Progress", value: "18" }, { label: "Completed", value: "12" }, { label: "At Risk", value: "5" }].map((s, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded">
                <div className="p-3 border-b border-gray-100">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50"><tr>{["Project", "Client", "Team", "Progress", "Priority", "Status", "Deadline"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(p => (
                                <tr key={p.id}>
                                    <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900">{p.name}</p><p className="text-xs text-gray-500">PM: {p.pm}</p></td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{p.client}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{p.team}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${p.progress}%` }} /></div>
                                            <span className="text-xs text-gray-600">{p.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${p.priority === "Critical" ? "bg-red-100 text-red-700" : p.priority === "High" ? "bg-yellow-100 text-yellow-700" : p.priority === "Medium" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{p.priority}</span></td>
                                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${p.status === "In Progress" ? "bg-blue-100 text-blue-700" : p.status === "UAT" ? "bg-purple-100 text-purple-700" : p.status === "Completed" ? "bg-green-100 text-green-700" : "bg-cyan-100 text-cyan-700"}`}>{p.status}</span></td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{p.deadline}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;
