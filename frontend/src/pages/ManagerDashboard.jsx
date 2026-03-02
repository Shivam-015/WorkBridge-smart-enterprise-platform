import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagerProjectsPage from "./manager/ManagerProjectsPage";
import ManagerTeamPage from "./manager/ManagerTeamPage";
import ManagerTasksPage from "./manager/ManagerTasksPage";
import ManagerReportsPage from "./manager/ManagerReportsPage";

const ManagerSettings = () => {
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500 mt-1">Manage your preferences</p></div>
      <div className="bg-white border border-gray-200 rounded p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Full Name", value: "Arjun Patel" },
            { label: "Email", value: "arjun@workbridge.io" },
            { label: "Phone", value: "+91 98765 43211" },
            { label: "Role", value: "Project Manager", disabled: true },
          ].map((f, i) => (
            <div key={i}><label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type="text" defaultValue={f.value} disabled={f.disabled} className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${f.disabled ? "bg-gray-50 text-gray-500" : ""}`} /></div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
          {saved && <span className="text-sm text-green-600">✓ Saved!</span>}
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const stored = typeof window !== "undefined" ? localStorage.getItem("user") || sessionStorage.getItem("user") : null;
  const userName = stored ? JSON.parse(stored)?.name ?? "Manager" : "Manager";

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "projects", label: "My Projects" },
    { id: "team", label: "My Team" },
    { id: "tasks", label: "Tasks" },
    { id: "sla", label: "SLA Tracking" },
    { id: "attendance", label: "Attendance" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  const summaryCards = [
    { title: "My Projects", value: "4", trend: "+1" },
    { title: "Team Members", value: "6", trend: "+2" },
    { title: "Tasks In Progress", value: "24", trend: "-3" },
    { title: "SLA Compliance", value: "94%", trend: "+2%" },
  ];

  const recentActivities = [
    { id: 1, text: "Sprint 14 review completed for Project Apollo", type: "Project", time: "30 min ago" },
    { id: 2, text: "Riya Sharma submitted 3 pull requests", type: "Team", time: "1 hr ago" },
    { id: 3, text: "Orion ERP — database migration task blocked", type: "Alert", time: "2 hrs ago" },
    { id: 4, text: "Weekly standup notes auto-generated", type: "System", time: "3 hrs ago" },
    { id: 5, text: "Mercury CRM moved to UAT phase", type: "Project", time: "5 hrs ago" },
  ];

  const handleLogout = () => { localStorage.removeItem("user"); sessionStorage.removeItem("user"); navigate("/login"); };

  const sidebarNav = (
    <>
      {menuItems.map(item => (
        <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
          className={`w-full text-left px-4 py-2 text-sm ${activeTab === item.id ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}>
          {item.label}
        </button>
      ))}
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="hidden lg:flex flex-col w-56 bg-gray-800 text-white flex-shrink-0">
        <div className="px-4 py-4 font-bold text-lg border-b border-gray-700">WorkBridge</div>
        <nav className="flex-1 py-2">{sidebarNav}</nav>
        <div className="px-4 py-3 border-t border-gray-700"><button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Logout</button></div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-64 h-full flex flex-col bg-gray-800 text-white">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <span className="font-bold">WorkBridge</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white">✕</button>
            </div>
            <nav className="flex-1 py-2">{sidebarNav}</nav>
            <div className="px-4 py-3 border-t border-gray-700"><button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Logout</button></div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-gray-600 text-lg">☰</button>
            <span className="text-sm font-medium text-gray-700">Welcome, {userName}</span>
          </div>
          <span className="text-xs text-gray-500">Project Manager</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div><h1 className="text-xl font-bold text-gray-900">Manager Dashboard</h1><p className="text-sm text-gray-500 mt-1">Here's your project overview.</p></div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded p-4">
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.trend}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded">
                  <div className="px-4 py-3 border-b border-gray-100"><h2 className="text-base font-semibold text-gray-900">Recent Activity</h2></div>
                  <ul className="divide-y divide-gray-100">
                    {recentActivities.map(a => (
                      <li key={a.id} className="px-4 py-3">
                        <p className="text-sm text-gray-800">{a.text}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-blue-600 font-medium">{a.type}</span>
                          <span className="text-xs text-gray-400">{a.time}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Current Sprint</h2>
                  {[
                    { label: "To Do", value: 8, max: 24 },
                    { label: "In Progress", value: 10, max: 24 },
                    { label: "In Review", value: 3, max: 24 },
                    { label: "Done", value: 3, max: 24 },
                  ].map((s, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{s.label}</span><span className="font-medium text-gray-900">{s.value}/{s.max}</span></div>
                      <div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(s.value / s.max) * 100}%` }} /></div>
                    </div>
                  ))}
                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-sm">
                    <span className="text-gray-500">Sprint ends in</span><span className="font-medium text-gray-900">5 days</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "projects" && <ManagerProjectsPage />}
          {activeTab === "team" && <ManagerTeamPage />}
          {activeTab === "tasks" && <ManagerTasksPage />}
          {activeTab === "sla" && (
            <div className="space-y-4">
              <div><h1 className="text-xl font-bold text-gray-900">SLA Tracking</h1><p className="text-sm text-gray-500 mt-1">Monitor SLA compliance for your projects</p></div>
              <div className="grid grid-cols-3 gap-4">
                {[{ label: "Compliance Rate", value: "94%" }, { label: "At Risk", value: "2" }, { label: "Breached", value: "1" }].map((s, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded p-4"><p className="text-sm text-gray-500">{s.label}</p><p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p></div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">SLA Status by Project</h2>
                {[
                  { project: "Project Apollo", metric: "Response Time", status: "Met", target: "2 hrs", actual: "1.4 hrs" },
                  { project: "Mercury CRM", metric: "Uptime", status: "At Risk", target: "99.9%", actual: "99.7%" },
                  { project: "Orion ERP", metric: "Bug Fix SLA", status: "Breached", target: "48 hrs", actual: "56 hrs" },
                  { project: "Titan Portal", metric: "Resolution Time", status: "Met", target: "24 hrs", actual: "18 hrs" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div><p className="text-sm font-medium text-gray-900">{s.project}</p><p className="text-xs text-gray-500">{s.metric}: {s.target} → {s.actual}</p></div>
                    <span className={`text-xs px-2 py-0.5 rounded ${s.status === "Met" ? "bg-green-100 text-green-700" : s.status === "At Risk" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "attendance" && (
            <div className="space-y-4">
              <div><h1 className="text-xl font-bold text-gray-900">Team Attendance</h1><p className="text-sm text-gray-500 mt-1">Track your team's attendance today</p></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[{ label: "Present", value: "5" }, { label: "On Leave", value: "1" }, { label: "Late", value: "0" }, { label: "Avg. Hours", value: "8.5h" }].map((s, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr>{["Member", "Check In", "Check Out", "Hours", "Status"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { name: "Riya Sharma", in: "09:02 AM", out: "06:15 PM", hrs: "9h 13m", status: "Present" },
                      { name: "Vikram Singh", in: "08:45 AM", out: "05:50 PM", hrs: "9h 05m", status: "Present" },
                      { name: "Priya Nair", in: "09:10 AM", out: "06:30 PM", hrs: "9h 20m", status: "Present" },
                      { name: "Rahul Verma", in: "09:00 AM", out: "—", hrs: "Active", status: "Present" },
                      { name: "Ananya Das", in: "—", out: "—", hrs: "—", status: "On Leave" },
                      { name: "Karan Mehta", in: "08:55 AM", out: "06:00 PM", hrs: "9h 05m", status: "Present" },
                    ].map((a, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{a.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{a.in}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{a.out}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{a.hrs}</td>
                        <td className="px-4 py-2"><span className={`text-xs px-2 py-0.5 rounded ${a.status === "Present" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "reports" && <ManagerReportsPage />}
          {activeTab === "settings" && <ManagerSettings />}
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;