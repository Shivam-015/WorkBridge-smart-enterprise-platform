import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ────── Inline Pages ────── */

const MyTasksPage = () => {
  const [filter, setFilter] = useState("All");
  const tasks = [
    { id: 1, title: "Implement login validation", project: "Project Apollo", priority: "High", status: "In Progress", due: "Mar 05, 2026" },
    { id: 2, title: "Fix responsive layout bugs", project: "Mercury CRM", priority: "Medium", status: "To Do", due: "Mar 07, 2026" },
    { id: 3, title: "Write API documentation", project: "Project Apollo", priority: "Low", status: "Completed", due: "Feb 28, 2026" },
    { id: 4, title: "Code review — auth module", project: "Titan Portal", priority: "High", status: "In Progress", due: "Mar 04, 2026" },
    { id: 5, title: "Unit tests for dashboard", project: "Mercury CRM", priority: "Medium", status: "To Do", due: "Mar 10, 2026" },
    { id: 6, title: "Optimize database queries", project: "Orion ERP", priority: "Critical", status: "Blocked", due: "Mar 03, 2026" },
  ];
  const statuses = ["All", "To Do", "In Progress", "Completed", "Blocked"];
  const filtered = filter === "All" ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-bold text-gray-900">My Tasks</h1><p className="text-sm text-gray-500 mt-1">Your assigned tasks across all projects</p></div>
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (<button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-sm rounded ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}>{s}</button>))}
      </div>
      <div className="space-y-2">
        {filtered.map(task => (
          <div key={task.id} className="bg-white border border-gray-200 rounded p-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
              <p className="text-xs text-gray-500">{task.project} · Due: {task.due}</p>
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

const MyAttendancePage = () => (
  <div className="space-y-4">
    <div><h1 className="text-xl font-bold text-gray-900">My Attendance</h1><p className="text-sm text-gray-500 mt-1">Your attendance and work hours</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[{ label: "Days Present", value: "22" }, { label: "Days Absent", value: "1" }, { label: "Leaves Taken", value: "3" }, { label: "Avg. Hours/Day", value: "8.7h" }].map((s, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
      ))}
    </div>
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50"><tr>{["Date", "Check In", "Check Out", "Hours", "Status"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-gray-100">
          {[
            { date: "Mar 01", in: "09:02 AM", out: "06:15 PM", hrs: "9h 13m", status: "Present" },
            { date: "Feb 28", in: "08:55 AM", out: "06:00 PM", hrs: "9h 05m", status: "Present" },
            { date: "Feb 27", in: "09:30 AM", out: "06:45 PM", hrs: "9h 15m", status: "Late" },
            { date: "Feb 26", in: "09:00 AM", out: "05:50 PM", hrs: "8h 50m", status: "Present" },
            { date: "Feb 25", in: "—", out: "—", hrs: "—", status: "Leave" },
          ].map((a, i) => (
            <tr key={i}>
              <td className="px-4 py-2 text-sm text-gray-900">{a.date}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{a.in}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{a.out}</td>
              <td className="px-4 py-2 text-sm font-medium text-gray-900">{a.hrs}</td>
              <td className="px-4 py-2"><span className={`text-xs px-2 py-0.5 rounded ${a.status === "Present" ? "bg-green-100 text-green-700" : a.status === "Late" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{a.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const LeavesPage = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div><h1 className="text-xl font-bold text-gray-900">Leave Management</h1><p className="text-sm text-gray-500 mt-1">Apply and track your leaves</p></div>
      <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Apply Leave</button>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[{ label: "Total Balance", value: "18" }, { label: "Used", value: "3" }, { label: "Pending", value: "1" }, { label: "Remaining", value: "15" }].map((s, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
      ))}
    </div>
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50"><tr>{["Type", "From", "To", "Days", "Reason", "Status"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-gray-100">
          {[
            { type: "Casual Leave", from: "Feb 25, 2026", to: "Feb 25, 2026", days: 1, status: "Approved", reason: "Personal work" },
            { type: "Sick Leave", from: "Jan 15, 2026", to: "Jan 16, 2026", days: 2, status: "Approved", reason: "Fever" },
            { type: "Casual Leave", from: "Mar 10, 2026", to: "Mar 11, 2026", days: 2, status: "Pending", reason: "Family function" },
          ].map((l, i) => (
            <tr key={i}>
              <td className="px-4 py-2 text-sm font-medium text-gray-900">{l.type}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{l.from}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{l.to}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{l.days}</td>
              <td className="px-4 py-2 text-sm text-gray-500">{l.reason}</td>
              <td className="px-4 py-2"><span className={`text-xs px-2 py-0.5 rounded ${l.status === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{l.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TimesheetPage = () => (
  <div className="space-y-4">
    <div><h1 className="text-xl font-bold text-gray-900">Timesheet</h1><p className="text-sm text-gray-500 mt-1">Log and track your work hours</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[{ label: "Today", value: "6h 30m" }, { label: "This Week", value: "32h" }, { label: "This Month", value: "145h" }, { label: "Billable", value: "92%" }].map((s, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
      ))}
    </div>
    <div className="bg-white border border-gray-200 rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Today's Log</h2>
        <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700">▶ Start Timer</button>
      </div>
      {[
        { task: "Implement login validation", project: "Project Apollo", duration: "2h 30m", status: "Done" },
        { task: "Code review — auth module", project: "Titan Portal", duration: "1h 15m", status: "Done" },
        { task: "Fix responsive layout bugs", project: "Mercury CRM", duration: "2h 45m", status: "Active" },
      ].map((t, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
          <div><p className="text-sm font-medium text-gray-900">{t.task}</p><p className="text-xs text-gray-500">{t.project}</p></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{t.duration}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${t.status === "Active" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{t.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmpSettings = () => {
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500 mt-1">Your profile and preferences</p></div>
      <div className="bg-white border border-gray-200 rounded p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[{ label: "Full Name", value: "Riya Sharma" }, { label: "Email", value: "riya@workbridge.io" }, { label: "Phone", value: "+91 98765 43210" }, { label: "Role", value: "Frontend Developer", disabled: true }, { label: "Department", value: "Engineering", disabled: true }, { label: "Manager", value: "Arjun Patel", disabled: true }].map((f, i) => (
            <div key={i}><label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label><input type="text" defaultValue={f.value} disabled={f.disabled} className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${f.disabled ? "bg-gray-50 text-gray-500" : ""}`} /></div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
          {saved && <span className="text-sm text-green-600">✓ Saved!</span>}
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
};

/* ────── Main Dashboard ────── */

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const stored = typeof window !== "undefined" ? localStorage.getItem("user") || sessionStorage.getItem("user") : null;
  const userName = stored ? JSON.parse(stored)?.name ?? "Employee" : "Employee";

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "tasks", label: "My Tasks" },
    { id: "attendance", label: "Attendance" },
    { id: "leaves", label: "Leaves" },
    { id: "timesheet", label: "Timesheet" },
    { id: "settings", label: "Settings" },
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
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-56 bg-gray-800 text-white flex-shrink-0">
        <div className="px-4 py-4 font-bold text-lg border-b border-gray-700">WorkBridge</div>
        <nav className="flex-1 py-2">{sidebarNav}</nav>
        <div className="px-4 py-3 border-t border-gray-700"><button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Logout</button></div>
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
            <nav className="flex-1 py-2">{sidebarNav}</nav>
            <div className="px-4 py-3 border-t border-gray-700"><button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Logout</button></div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-gray-600 text-lg">☰</button>
            <span className="text-sm font-medium text-gray-700">Welcome, {userName}</span>
          </div>
          <span className="text-xs text-gray-500">Employee</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div><h1 className="text-xl font-bold text-gray-900">My Dashboard</h1><p className="text-sm text-gray-500 mt-1">Welcome back, {userName}</p></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[{ title: "Tasks Assigned", value: "12", sub: "3 due today" }, { title: "Completed", value: "42", sub: "This month" }, { title: "Hours Logged", value: "145h", sub: "This month" }, { title: "Leave Balance", value: "15", sub: "Days remaining" }].map((card, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded p-4">
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded">
                  <div className="px-4 py-3 border-b border-gray-100"><h2 className="text-base font-semibold text-gray-900">Today's Tasks</h2></div>
                  <div className="divide-y divide-gray-100">
                    {[
                      { title: "Implement login validation", project: "Project Apollo", status: "In Progress", priority: "High" },
                      { title: "Code review — auth module", project: "Titan Portal", status: "In Progress", priority: "High" },
                      { title: "Fix responsive layout bugs", project: "Mercury CRM", status: "To Do", priority: "Medium" },
                    ].map((t, i) => (
                      <div key={i} className="px-4 py-3 flex items-center justify-between">
                        <div><p className="text-sm text-gray-800">{t.title}</p><p className="text-xs text-gray-500">{t.project}</p></div>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${t.priority === "High" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{t.priority}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${t.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{t.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h2>
                  <div className="space-y-2">
                    {["Clock In", "Apply Leave", "Log Time", "View Payslip"].map((a, i) => (
                      <button key={i} className="w-full text-left p-2 rounded text-sm text-gray-700 border border-gray-200 hover:bg-gray-50">{a}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "tasks" && <MyTasksPage />}
          {activeTab === "attendance" && <MyAttendancePage />}
          {activeTab === "leaves" && <LeavesPage />}
          {activeTab === "timesheet" && <TimesheetPage />}
          {activeTab === "settings" && <EmpSettings />}
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;