import React, { useState } from "react";

const employees = [
    { id: 1, name: "Riya Sharma", role: "Frontend Developer", department: "Engineering", location: "Mumbai", status: "Active", joined: "Jan 2024" },
    { id: 2, name: "Arjun Patel", role: "Project Manager", department: "Management", location: "Delhi", status: "Active", joined: "Mar 2023" },
    { id: 3, name: "Priya Nair", role: "UI/UX Designer", department: "Design", location: "Bangalore", status: "Active", joined: "Jun 2023" },
    { id: 4, name: "Vikram Singh", role: "Backend Developer", department: "Engineering", location: "Hyderabad", status: "On Leave", joined: "Sep 2023" },
    { id: 5, name: "Neha Gupta", role: "HR Manager", department: "Human Resources", location: "Chennai", status: "Active", joined: "Feb 2024" },
    { id: 6, name: "Rahul Verma", role: "DevOps Engineer", department: "Engineering", location: "Pune", status: "Active", joined: "Nov 2023" },
    { id: 7, name: "Ananya Das", role: "QA Lead", department: "Quality", location: "Kolkata", status: "Inactive", joined: "Apr 2023" },
    { id: 8, name: "Karan Mehta", role: "Data Analyst", department: "Analytics", location: "Mumbai", status: "Active", joined: "Jul 2024" },
];

const EmployeesPage = () => {
    const [search, setSearch] = useState("");
    const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div><h1 className="text-xl font-bold text-gray-900">Employees</h1><p className="text-sm text-gray-500 mt-1">Manage your team members and their roles</p></div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">+ Add Employee</button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[{ label: "Total Employees", value: "248" }, { label: "Active", value: "231" }, { label: "On Leave", value: "12" }, { label: "New This Month", value: "8" }].map((s, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded">
                <div className="p-3 border-b border-gray-100">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50"><tr>{["Employee", "Department", "Location", "Status", "Joined", "Actions"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(emp => (
                                <tr key={emp.id}>
                                    <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900">{emp.name}</p><p className="text-xs text-gray-500">{emp.role}</p></td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{emp.department}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{emp.location}</td>
                                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${emp.status === "Active" ? "bg-green-100 text-green-700" : emp.status === "On Leave" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{emp.status}</span></td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{emp.joined}</td>
                                    <td className="px-4 py-3"><button className="text-xs text-blue-600 hover:underline">View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 border-t border-gray-100 text-sm text-gray-500">Showing {filtered.length} of {employees.length} employees</div>
            </div>
        </div>
    );
};

export default EmployeesPage;
