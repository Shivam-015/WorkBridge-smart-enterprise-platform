import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ────── Inline Pages ────── */

const ClientProjectsPage = () => (
  <div className="space-y-4">
    <div><h1 className="text-xl font-bold text-gray-900">My Projects</h1><p className="text-sm text-gray-500 mt-1">Track the progress of your contracted projects</p></div>
    {[
      { name: "Project Apollo", pm: "Arjun Patel", progress: 75, status: "In Progress", budget: "$120K", spent: "$85K", deadline: "Mar 15, 2026", milestones: { total: 8, done: 6 } },
      { name: "Titan Portal", pm: "Arjun Patel", progress: 55, status: "In Progress", budget: "$180K", spent: "$92K", deadline: "Apr 20, 2026", milestones: { total: 10, done: 5 } },
    ].map((p, i) => (
      <div key={i} className="bg-white border border-gray-200 rounded p-4">
        <div className="flex justify-between items-start mb-3">
          <div><h3 className="text-base font-semibold text-gray-900">{p.name}</h3><p className="text-xs text-gray-500">PM: {p.pm} · Deadline: {p.deadline}</p></div>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">{p.status}</span>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Progress</span><span className="font-medium text-gray-900">{p.progress}%</span></div>
          <div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${p.progress}%` }} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div><p className="text-gray-500 text-xs">Budget</p><p className="font-medium text-gray-900">{p.budget}</p></div>
          <div><p className="text-gray-500 text-xs">Spent</p><p className="font-medium text-gray-900">{p.spent}</p></div>
          <div><p className="text-gray-500 text-xs">Milestones</p><p className="font-medium text-gray-900">{p.milestones.done}/{p.milestones.total}</p></div>
        </div>
      </div>
    ))}
  </div>
);

const InvoicesPage = () => (
  <div className="space-y-4">
    <div><h1 className="text-xl font-bold text-gray-900">Invoices</h1><p className="text-sm text-gray-500 mt-1">View and manage your invoices</p></div>
    <div className="grid grid-cols-3 gap-3">
      {[{ label: "Total Billed", value: "$205K" }, { label: "Paid", value: "$163K" }, { label: "Pending", value: "$42K" }].map((s, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
      ))}
    </div>
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50"><tr>{["Invoice", "Project", "Amount", "Date", "Due", "Status"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-gray-100">
          {[
            { id: "INV-001", project: "Project Apollo", amount: "$24,500", date: "Mar 01", due: "Mar 15", status: "Pending" },
            { id: "INV-002", project: "Titan Portal", amount: "$35,000", date: "Feb 18", due: "Mar 04", status: "Paid" },
            { id: "INV-003", project: "Project Apollo", amount: "$18,200", date: "Feb 01", due: "Feb 15", status: "Paid" },
            { id: "INV-004", project: "Titan Portal", amount: "$42,000", date: "Jan 15", due: "Jan 30", status: "Paid" },
          ].map((inv, i) => (
            <tr key={i}>
              <td className="px-4 py-2 text-sm font-mono text-blue-600">{inv.id}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{inv.project}</td>
              <td className="px-4 py-2 text-sm font-medium text-gray-900">{inv.amount}</td>
              <td className="px-4 py-2 text-sm text-gray-500">{inv.date}</td>
              <td className="px-4 py-2 text-sm text-gray-500">{inv.due}</td>
              <td className="px-4 py-2"><span className={`text-xs px-2 py-0.5 rounded ${inv.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{inv.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SupportPage = () => {
  const tickets = [
    { id: "TKT-101", subject: "Login issue on staging", project: "Project Apollo", status: "Open", priority: "High", date: "Mar 01" },
    { id: "TKT-098", subject: "Dashboard data not loading", project: "Titan Portal", status: "In Progress", priority: "Medium", date: "Feb 28" },
    { id: "TKT-095", subject: "Export CSV not working", project: "Project Apollo", status: "Resolved", priority: "Low", date: "Feb 25" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div><h1 className="text-xl font-bold text-gray-900">Support</h1><p className="text-sm text-gray-500 mt-1">Raise and track support tickets</p></div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">+ New Ticket</button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{ label: "Open", value: "1" }, { label: "In Progress", value: "1" }, { label: "Resolved", value: "12" }].map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
        ))}
      </div>
      <div className="space-y-2">
        {tickets.map(t => (
          <div key={t.id} className="bg-white border border-gray-200 rounded p-3 flex items-center justify-between">
            <div>
              <div className="flex gap-2 items-center"><span className="text-xs font-mono text-blue-600">{t.id}</span><span className={`text-xs px-2 py-0.5 rounded ${t.priority === "High" ? "bg-yellow-100 text-yellow-700" : t.priority === "Medium" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{t.priority}</span></div>
              <h3 className="text-sm font-medium text-gray-900 mt-1">{t.subject}</h3>
              <p className="text-xs text-gray-500">{t.project} · {t.date}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${t.status === "Open" ? "bg-red-100 text-red-700" : t.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientSLAPage = () => (
  <div className="space-y-4">
    <div><h1 className="text-xl font-bold text-gray-900">SLA Dashboard</h1><p className="text-sm text-gray-500 mt-1">Service level agreement compliance</p></div>
    <div className="grid grid-cols-3 gap-3">
      {[{ label: "Overall Compliance", value: "94%" }, { label: "At Risk", value: "1" }, { label: "Breached", value: "0" }].map((s, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded p-4"><p className="text-sm text-gray-500">{s.label}</p><p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p></div>
      ))}
    </div>
    <div className="bg-white border border-gray-200 rounded p-4">
      <h2 className="text-base font-semibold text-gray-900 mb-3">SLA by Metric</h2>
      {[
        { metric: "Response Time", target: "< 2 hrs", actual: "1.4 hrs", status: "Met" },
        { metric: "Uptime", target: "99.9%", actual: "99.8%", status: "At Risk" },
        { metric: "Bug Resolution", target: "48 hrs", actual: "36 hrs", status: "Met" },
        { metric: "Deployment Frequency", target: "Weekly", actual: "Weekly", status: "Met" },
      ].map((s, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
          <div><p className="text-sm font-medium text-gray-900">{s.metric}</p><p className="text-xs text-gray-500">Target: {s.target} → Actual: {s.actual}</p></div>
          <span className={`text-xs px-2 py-0.5 rounded ${s.status === "Met" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{s.status}</span>
        </div>
      ))}
    </div>
  </div>
);

const ClientSettings = () => {
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500 mt-1">Your account preferences</p></div>
      <div className="bg-white border border-gray-200 rounded p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[{ label: "Company", value: "Zenith Corp" }, { label: "Contact Person", value: "Rajesh Kumar" }, { label: "Email", value: "rajesh@zenithcorp.com" }, { label: "Phone", value: "+91 98765 12345" }].map((f, i) => (
            <div key={i}><label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label><input type="text" defaultValue={f.value} className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
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

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const stored = typeof window !== "undefined" ? localStorage.getItem("user") || sessionStorage.getItem("user") : null;
  const userName = stored ? JSON.parse(stored)?.name ?? "Client" : "Client";

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "projects", label: "My Projects" },
    { id: "invoices", label: "Invoices" },
    { id: "support", label: "Support" },
    { id: "sla", label: "SLA Dashboard" },
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
          <span className="text-xs text-gray-500">Client</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div><h1 className="text-xl font-bold text-gray-900">Client Dashboard</h1><p className="text-sm text-gray-500 mt-1">Here's your project overview.</p></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Active Projects", value: "2" },
                  { title: "Pending Invoices", value: "$24.5K" },
                  { title: "Open Tickets", value: "1" },
                  { title: "SLA Compliance", value: "94%" },
                ].map((card, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded p-4">
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{card.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Project Progress</h2>
                  {[{ name: "Project Apollo", progress: 75 }, { name: "Titan Portal", progress: 55 }].map((p, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{p.name}</span><span className="font-medium text-gray-900">{p.progress}%</span></div>
                      <div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${p.progress}%` }} /></div>
                    </div>
                  ))}
                </div>
                <div className="bg-white border border-gray-200 rounded p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Recent Updates</h2>
                  {[
                    { text: "Sprint 14 completed for Project Apollo", time: "2 hrs ago" },
                    { text: "Invoice INV-001 generated — $24,500", time: "1 day ago" },
                    { text: "Titan Portal milestone 5 delivered", time: "3 days ago" },
                  ].map((a, i) => (
                    <div key={i} className="py-2 border-b border-gray-100 last:border-0">
                      <p className="text-sm text-gray-800">{a.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "projects" && <ClientProjectsPage />}
          {activeTab === "invoices" && <InvoicesPage />}
          {activeTab === "support" && <SupportPage />}
          {activeTab === "sla" && <ClientSLAPage />}
          {activeTab === "settings" && <ClientSettings />}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;