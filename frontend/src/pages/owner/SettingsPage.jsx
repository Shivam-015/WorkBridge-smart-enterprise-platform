import React, { useState } from "react";

const settingSections = [
    { id: "profile", label: "Profile Settings", desc: "Manage your personal information" },
    { id: "notifications", label: "Notifications", desc: "Configure notification preferences" },
    { id: "security", label: "Security", desc: "Password, 2FA, and sessions" },
    { id: "organization", label: "Organization", desc: "Company details and branding" },
    { id: "appearance", label: "Appearance", desc: "Theme and display preferences" },
    { id: "integrations", label: "Integrations", desc: "Third-party services and APIs" },
    { id: "email", label: "Email Settings", desc: "SMTP and email templates" },
];

const SettingsPage = () => {
    const [activeSection, setActiveSection] = useState("profile");
    const [saved, setSaved] = useState(false);
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    return (
        <div className="space-y-4">
            <div><h1 className="text-xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500 mt-1">Manage your platform configurations</p></div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded p-2">
                    <nav className="space-y-0.5">
                        {settingSections.map(s => (
                            <button key={s.id} onClick={() => setActiveSection(s.id)}
                                className={`w-full text-left px-3 py-2 rounded text-sm ${activeSection === s.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                                {s.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="lg:col-span-3 bg-white border border-gray-200 rounded p-4">
                    {activeSection === "profile" && (
                        <div className="space-y-4">
                            <h2 className="text-base font-semibold text-gray-900">Profile Settings</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { label: "Full Name", value: "Admin User" },
                                    { label: "Email", value: "admin@workbridge.io" },
                                    { label: "Phone", value: "+91 98765 43210" },
                                    { label: "Role", value: "Super Admin", disabled: true },
                                    { label: "Department", value: "Executive" },
                                    { label: "Location", value: "Mumbai, India" },
                                ].map((f, i) => (
                                    <div key={i}><label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                                        <input type="text" defaultValue={f.value} disabled={f.disabled} className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${f.disabled ? "bg-gray-50 text-gray-500" : ""}`} /></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === "notifications" && (
                        <div className="space-y-4">
                            <h2 className="text-base font-semibold text-gray-900">Notification Preferences</h2>
                            {[
                                { label: "Email Notifications", desc: "Receive email alerts for important events", default: true },
                                { label: "Push Notifications", desc: "Browser push notifications for real-time updates", default: true },
                                { label: "SLA Breach Alerts", desc: "Immediate notification when an SLA is breached", default: true },
                                { label: "Weekly Digest", desc: "Summary sent every Monday", default: false },
                                { label: "New Employee Onboarding", desc: "Alerts on employee onboarding", default: true },
                                { label: "Project Status Changes", desc: "Notifications on project milestones", default: false },
                            ].map((n, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                                    <div><p className="text-sm font-medium text-gray-800">{n.label}</p><p className="text-xs text-gray-500">{n.desc}</p></div>
                                    <input type="checkbox" defaultChecked={n.default} className="rounded border-gray-300" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === "security" && (
                        <div className="space-y-4">
                            <h2 className="text-base font-semibold text-gray-900">Security Settings</h2>
                            {[
                                { label: "Password", desc: "Last changed 30 days ago", action: "Change" },
                                { label: "Two-Factor Authentication", desc: "Add an extra layer of security", action: "Enabled" },
                                { label: "Active Sessions", desc: "2 active sessions", action: "Revoke All" },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                                    <div><p className="text-sm font-medium text-gray-800">{s.label}</p><p className="text-xs text-gray-500">{s.desc}</p></div>
                                    <button className="text-xs text-blue-600 hover:underline">{s.action}</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {!["profile", "notifications", "security"].includes(activeSection) && (
                        <div className="text-center py-12">
                            <h3 className="text-base font-semibold text-gray-700">{settingSections.find(s => s.id === activeSection)?.label}</h3>
                            <p className="text-sm text-gray-500 mt-1">{settingSections.find(s => s.id === activeSection)?.desc}</p>
                            <p className="text-xs text-gray-400 mt-2">Configuration options coming soon</p>
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                        {saved && <span className="text-sm text-green-600">✓ Saved!</span>}
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
