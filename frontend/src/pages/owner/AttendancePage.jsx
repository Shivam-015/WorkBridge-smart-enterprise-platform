import React, { useState } from "react";

const attendanceData = [
    { id: 1, name: "Riya Sharma", department: "Engineering", checkIn: "09:02 AM", checkOut: "06:15 PM", hours: "9h 13m", status: "Present" },
    { id: 2, name: "Arjun Patel", department: "Management", checkIn: "08:45 AM", checkOut: "05:50 PM", hours: "9h 05m", status: "Present" },
    { id: 3, name: "Priya Nair", department: "Design", checkIn: "—", checkOut: "—", hours: "—", status: "Absent" },
    { id: 4, name: "Vikram Singh", department: "Engineering", checkIn: "—", checkOut: "—", hours: "—", status: "On Leave" },
    { id: 5, name: "Neha Gupta", department: "HR", checkIn: "09:30 AM", checkOut: "06:45 PM", hours: "9h 15m", status: "Present" },
    { id: 6, name: "Rahul Verma", department: "Engineering", checkIn: "10:15 AM", checkOut: "07:00 PM", hours: "8h 45m", status: "Late" },
    { id: 7, name: "Ananya Das", department: "Quality", checkIn: "08:55 AM", checkOut: "05:30 PM", hours: "8h 35m", status: "Present" },
    { id: 8, name: "Karan Mehta", department: "Analytics", checkIn: "09:00 AM", checkOut: "—", hours: "Active", status: "Present" },
];

const AttendancePage = () => {
    const [search, setSearch] = useState("");
    const filtered = attendanceData.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-4">
            <div><h1 className="text-xl font-bold text-gray-900">Attendance</h1><p className="text-sm text-gray-500 mt-1">Monitor daily attendance and work hours</p></div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[{ label: "Present Today", value: "198" }, { label: "Absent", value: "12" }, { label: "On Leave", value: "18" }, { label: "Late Arrivals", value: "8" }].map((s, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded p-3"><p className="text-sm text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p></div>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded">
                <div className="p-3 border-b border-gray-100">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50"><tr>{["Employee", "Department", "Check In", "Check Out", "Hours", "Status"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(a => (
                                <tr key={a.id}>
                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{a.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{a.department}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{a.checkIn}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{a.checkOut}</td>
                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{a.hours}</td>
                                    <td className="px-4 py-2"><span className={`text-xs px-2 py-0.5 rounded ${a.status === "Present" ? "bg-green-100 text-green-700" : a.status === "Absent" ? "bg-red-100 text-red-700" : a.status === "On Leave" ? "bg-yellow-100 text-yellow-700" : "bg-orange-100 text-orange-700"}`}>{a.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
