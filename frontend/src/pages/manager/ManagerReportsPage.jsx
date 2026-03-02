import React from "react";

const weeklyData = [
    { week: "W1", tasks: 18, completed: 15 },
    { week: "W2", tasks: 22, completed: 20 },
    { week: "W3", tasks: 25, completed: 19 },
    { week: "W4", tasks: 20, completed: 18 },
];

const teamPerformance = [
    { name: "Riya Sharma", tasks: 42, completed: 38, efficiency: 90 },
    { name: "Vikram Singh", tasks: 38, completed: 32, efficiency: 84 },
    { name: "Priya Nair", tasks: 29, completed: 27, efficiency: 93 },
    { name: "Rahul Verma", tasks: 35, completed: 30, efficiency: 86 },
    { name: "Karan Mehta", tasks: 22, completed: 19, efficiency: 86 },
];

const ManagerReportsPage = () => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <div><h1 className="text-xl font-bold text-gray-900">Reports</h1><p className="text-sm text-gray-500 mt-1">Team performance and project reports</p></div>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Export Report</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ label: "Tasks This Month", value: "85" }, { label: "Completion Rate", value: "87%" }, { label: "Avg. Time/Task", value: "4.2h" }, { label: "Team Utilization", value: "92%" }].map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Weekly Task Overview</h2>
                {weeklyData.map((w, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                        <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{w.week}</span><span className="text-xs text-gray-500">{w.completed}/{w.tasks} completed</span></div>
                        <div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(w.completed / w.tasks) * 100}%` }} /></div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Team Performance</h2>
                {teamPerformance.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                        <div className="w-28 text-sm text-gray-700 truncate">{m.name}</div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${m.efficiency}%` }} /></div>
                        <span className="text-sm font-medium text-gray-900 w-10 text-right">{m.efficiency}%</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default ManagerReportsPage;
