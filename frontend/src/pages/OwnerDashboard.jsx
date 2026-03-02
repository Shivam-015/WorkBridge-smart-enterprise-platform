import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeesPage from "./owner/EmployeesPage";
import ProjectsPage from "./owner/ProjectsPage";
import SLAPage from "./owner/SLAPage";
import AttendancePage from "./owner/AttendancePage";
import AnalyticsPage from "./owner/AnalyticsPage";
import ShadowingPage from "./owner/ShadowingPage";
import SettingsPage from "./owner/SettingsPage";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const stored = typeof window !== "undefined" ? localStorage.getItem("user") || sessionStorage.getItem("user") : null;
  const userName = stored ? JSON.parse(stored)?.name ?? "Admin" : "Admin";

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "employees", label: "Employees" },
    { id: "projects", label: "Projects" },
    { id: "sla", label: "SLA Monitoring" },
    { id: "attendance", label: "Attendance" },
    { id: "analytics", label: "Analytics" },
    { id: "shadowing", label: "Shadowing & KT" },
    { id: "settings", label: "Settings" },
  ];

  const summaryCards = [
    { title: "Total Employees", value: "248", trend: "+12%" },
    { title: "Active Projects", value: "36", trend: "+8%" },
    { title: "Revenue", value: "$1.24M", trend: "+18.2%" },
    { title: "SLA Breaches", value: "7", trend: "-3%" },
  ];

  const recentActivities = [
    { id: 1, text: "Riya Sharma completed onboarding", type: "Employee", time: "12 min ago" },
    { id: 2, text: "Project Apollo moved to UAT phase", type: "Project", time: "45 min ago" },
    { id: 3, text: "SLA breach warning — Client: Zenith Corp", type: "SLA Alert", time: "1 hr ago" },
    { id: 4, text: "Sprint 14 review approved by PM", type: "Project", time: "2 hrs ago" },
    { id: 5, text: "AI analytics report generated for Q4", type: "Analytics", time: "3 hrs ago" },
    { id: 6, text: "3 new employees joined the Design team", type: "Employee", time: "5 hrs ago" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-56 bg-gray-800 text-white flex-shrink-0">
        <div className="px-4 py-4 font-bold text-lg border-b border-gray-700">WorkBridge</div>
        <nav className="flex-1 py-2">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-2 text-sm ${activeTab === item.id ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-gray-700">
          <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Logout</button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-64 h-full flex flex-col bg-gray-800 text-white">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <span className="font-bold">WorkBridge</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white">✕</button>
            </div>
            <nav className="flex-1 py-2">
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm ${activeTab === item.id ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="px-4 py-3 border-t border-gray-700">
              <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Logout</button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-gray-600 text-lg">☰</button>
            <span className="text-sm font-medium text-gray-700">Welcome, {userName}</span>
          </div>
          <span className="text-xs text-gray-500">Super Admin</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Here's your enterprise at a glance.</p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded p-4">
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.trend}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                  {recentActivities.map((a) => (
                    <li key={a.id} className="px-4 py-3">
                      <p className="text-sm text-gray-800">{a.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-blue-600 font-medium">{a.type}</span>
                        <span className="text-xs text-gray-400">{a.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Stats */}
              <div className="bg-white border border-gray-200 rounded p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Stats</h2>
                {[
                  { label: "Pending Approvals", value: 14, max: 20 },
                  { label: "Tasks Processing", value: 47, max: 80 },
                  { label: "Completed Tasks", value: 63, max: 80 },
                ].map((s, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{s.label}</span>
                      <span className="font-medium text-gray-900">{s.value}/{s.max}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(s.value / s.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Risk Zone */}
              <div className="bg-white border border-gray-200 rounded p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">AI Risk Zone Indicator</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Healthy", count: 22, color: "text-green-600 bg-green-50" },
                    { label: "At Risk", count: 9, color: "text-yellow-600 bg-yellow-50" },
                    { label: "Critical", count: 5, color: "text-red-600 bg-red-50" },
                  ].map((zone, i) => (
                    <div key={i} className={`p-3 rounded text-center ${zone.color}`}>
                      <p className="text-lg font-bold">{zone.count}</p>
                      <p className="text-xs font-medium">{zone.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "employees" && <EmployeesPage />}
          {activeTab === "projects" && <ProjectsPage />}
          {activeTab === "sla" && <SLAPage />}
          {activeTab === "attendance" && <AttendancePage />}
          {activeTab === "analytics" && <AnalyticsPage />}
          {activeTab === "shadowing" && <ShadowingPage />}
          {activeTab === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;