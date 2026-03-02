import React from "react";

const slaData = [
    { id: 1, client: "Zenith Corp", project: "Project Apollo", metric: "Response Time", target: "2 hrs", actual: "1.5 hrs", status: "Met", trend: "↑" },
    { id: 2, client: "ByteFlow Inc", project: "Mercury CRM", metric: "Uptime", target: "99.9%", actual: "99.7%", status: "Breached", trend: "↓" },
    { id: 3, client: "Nova Systems", project: "Orion ERP", metric: "Resolution Time", target: "24 hrs", actual: "18 hrs", status: "Met", trend: "↑" },
    { id: 4, client: "DataPrime", project: "Nebula Analytics", metric: "Response Time", target: "4 hrs", actual: "3.8 hrs", status: "At Risk", trend: "↓" },
    { id: 5, client: "CloudNine", project: "Titan Portal", metric: "Uptime", target: "99.5%", actual: "99.6%", status: "Met", trend: "↑" },
    { id: 6, client: "InnoTech", project: "Vega Dashboard", metric: "Bug Fix SLA", target: "48 hrs", actual: "52 hrs", status: "Breached", trend: "↓" },
    { id: 7, client: "AlphaNet", project: "Stellar API", metric: "Response Time", target: "1 hr", actual: "45 min", status: "Met", trend: "↑" },
];

const SLAPage = () => (
    <div className="space-y-4">
        <div><h1 className="text-xl font-bold text-gray-900">SLA Monitoring</h1><p className="text-sm text-gray-500 mt-1">Track service-level agreements across all client projects</p></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ label: "Total SLAs", value: "42" }, { label: "Met", value: "32" }, { label: "At Risk", value: "3" }, { label: "Breached", value: "7" }].map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
            ))}
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">SLA Compliance Overview</h2>
            <div className="h-4 flex rounded-full overflow-hidden bg-gray-100">
                <div className="bg-green-500" style={{ width: "76%" }} />
                <div className="bg-yellow-400" style={{ width: "7%" }} />
                <div className="bg-red-500" style={{ width: "17%" }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Met (76%)</span><span>At Risk (7%)</span><span>Breached (17%)</span>
            </div>
        </div>

        <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <div className="p-3 border-b border-gray-100"><h2 className="text-base font-semibold text-gray-900">SLA Details</h2></div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50"><tr>{["Client", "Project", "Metric", "Target", "Actual", "Status", "Trend"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {slaData.map(s => (
                            <tr key={s.id}>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900">{s.client}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{s.project}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{s.metric}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{s.target}</td>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900">{s.actual}</td>
                                <td className="px-4 py-2"><span className={`text-xs px-2 py-0.5 rounded ${s.status === "Met" ? "bg-green-100 text-green-700" : s.status === "Breached" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{s.status}</span></td>
                                <td className="px-4 py-2 text-sm">{s.trend}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default SLAPage;
