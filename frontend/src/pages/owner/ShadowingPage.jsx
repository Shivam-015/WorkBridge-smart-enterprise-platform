import React from "react";

const sessions = [
    { id: 1, title: "Frontend Architecture Deep Dive", mentor: "Riya Sharma", mentee: "Karan Mehta", status: "In Progress", progress: 65, startDate: "Feb 10, 2026", endDate: "Mar 15, 2026", domain: "Engineering" },
    { id: 2, title: "Project Management Methodology", mentor: "Arjun Patel", mentee: "Neha Gupta", status: "Completed", progress: 100, startDate: "Jan 05, 2026", endDate: "Feb 20, 2026", domain: "Management" },
    { id: 3, title: "CI/CD Pipeline Mastery", mentor: "Rahul Verma", mentee: "Vikram Singh", status: "Scheduled", progress: 0, startDate: "Mar 05, 2026", endDate: "Apr 20, 2026", domain: "DevOps" },
    { id: 4, title: "Data Analytics Fundamentals", mentor: "Karan Mehta", mentee: "Ananya Das", status: "In Progress", progress: 40, startDate: "Feb 15, 2026", endDate: "Apr 01, 2026", domain: "Analytics" },
    { id: 5, title: "UI/UX Best Practices", mentor: "Priya Nair", mentee: "Riya Sharma", status: "In Progress", progress: 80, startDate: "Jan 20, 2026", endDate: "Mar 10, 2026", domain: "Design" },
];

const ShadowingPage = () => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <div><h1 className="text-xl font-bold text-gray-900">Shadowing & Knowledge Transfer</h1><p className="text-sm text-gray-500 mt-1">Manage mentorship and knowledge sharing sessions</p></div>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">+ New Session</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ label: "Active Sessions", value: "12" }, { label: "Completed", value: "28" }, { label: "Scheduled", value: "5" }, { label: "Mentors Active", value: "15" }].map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sessions.map(s => (
                <div key={s.id} className="bg-white border border-gray-200 rounded p-4">
                    <div className="flex justify-between mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${s.status === "In Progress" ? "bg-blue-100 text-blue-700" : s.status === "Completed" ? "bg-green-100 text-green-700" : "bg-cyan-100 text-cyan-700"}`}>{s.status}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{s.domain}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-xs text-gray-500 mb-1"><b>Mentor:</b> {s.mentor}</p>
                    <p className="text-xs text-gray-500 mb-1"><b>Mentee:</b> {s.mentee}</p>
                    <p className="text-xs text-gray-400 mb-3">{s.startDate} → {s.endDate}</p>
                    <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Progress</span><span className="text-gray-700 font-medium">{s.progress}%</span></div>
                        <div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${s.progress}%` }} /></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ShadowingPage;
