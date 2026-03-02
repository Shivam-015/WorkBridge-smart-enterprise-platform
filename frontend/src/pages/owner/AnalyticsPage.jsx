import React from "react";

const departmentPerf = [
    { dept: "Engineering", score: 92 },
    { dept: "Design", score: 88 },
    { dept: "Management", score: 85 },
    { dept: "Quality", score: 90 },
    { dept: "Analytics", score: 78 },
    { dept: "HR", score: 94 },
];

const aiInsights = [
    { text: "Engineering team productivity increased by 12% after sprint restructure", type: "positive" },
    { text: "Client Zenith Corp flagged as churn-risk — engagement dropped 20%", type: "warning" },
    { text: "Project Orion ERP likely to miss deadline by 2 weeks based on current velocity", type: "critical" },
    { text: "Employee satisfaction score trending upward for 3 consecutive months", type: "positive" },
];

const AnalyticsPage = () => (
    <div className="space-y-4">
        <div><h1 className="text-xl font-bold text-gray-900">Analytics</h1><p className="text-sm text-gray-500 mt-1">AI-driven insights and business intelligence</p></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ label: "Revenue Growth", value: "+18.2%", sub: "vs last quarter" }, { label: "Employee Productivity", value: "87%", sub: "avg. task completion" }, { label: "Project Delivery", value: "92%", sub: "on-time delivery" }, { label: "Client Retention", value: "96%", sub: "annual retention" }].map((k, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{k.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{k.value}</p><p className="text-xs text-gray-400">{k.sub}</p></div>
            ))}
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Department Performance</h2>
            {departmentPerf.map((d, i) => (
                <div key={i} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{d.dept}</span><span className="font-medium text-gray-900">{d.score}%</span></div>
                    <div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${d.score}%` }} /></div>
                </div>
            ))}
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">AI Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiInsights.map((ins, i) => (
                    <div key={i} className={`p-3 rounded border text-sm ${ins.type === "positive" ? "bg-green-50 border-green-200 text-green-800" : ins.type === "warning" ? "bg-yellow-50 border-yellow-200 text-yellow-800" : "bg-red-50 border-red-200 text-red-800"}`}>{ins.text}</div>
                ))}
            </div>
        </div>
    </div>
);

export default AnalyticsPage;
