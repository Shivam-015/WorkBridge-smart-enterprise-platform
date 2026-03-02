import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (message) setMessage("");
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) { setMessage("Email and password are required"); setMessageType("error"); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setMessage("Please enter a valid email address"); setMessageType("error"); return false; }
        if (formData.password.length < 6) { setMessage("Password must be at least 6 characters"); setMessageType("error"); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setMessage("");
        setMessageType("");
        try {
            const response = await apiClient.post("/login/", formData);
            const data = response.data;
            if (data.success) {
                setMessageType("success");
                setMessage(data.message || "Login successful!");
                if (rememberMe) { localStorage.setItem("user", JSON.stringify(data.data)); }
                else { sessionStorage.setItem("user", JSON.stringify(data.data)); }
                if (data.token) { localStorage.setItem("token", data.token); }
                const role = data.data.role?.toLowerCase();
                setTimeout(() => {
                    const roleRoutes = { owner: "/owner", employee: "/employee", manager: "/manager", client: "/client", hr: "/hr", recruiter: "/recruiter" };
                    navigate(roleRoutes[role] || "/dashboard");
                }, 1500);
            } else { setMessageType("error"); setMessage(data.message || "Invalid credentials"); }
        } catch (error) {
            setMessageType("error");
            if (error.response) setMessage(error.response.data?.message || "Invalid email or password");
            else if (error.request) setMessage("Network error. Please check your connection.");
            else setMessage("Something went wrong. Please try again.");
        } finally { setLoading(false); }
    };

    const handleDemoLogin = (role) => {
        const creds = {
            owner: { email: "owner@workbridge.com", password: "owner123" },
            employee: { email: "employee@workbridge.com", password: "employee123" },
            manager: { email: "manager@workbridge.com", password: "manager123" },
            client: { email: "client@workbridge.com", password: "client123" }
        };
        if (creds[role]) setFormData(creds[role]);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white border border-gray-200 rounded p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-500 mt-1 text-sm">Sign in to continue to WorkBridge</p>
                </div>

                {message && (
                    <div className={`mb-4 p-3 rounded text-sm ${messageType === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="you@example.com" disabled={loading} />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
                        </div>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-16"
                                placeholder="••••••••" disabled={loading} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700">
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <label className="flex items-center text-sm text-gray-600">
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                            className="mr-2 rounded border-gray-300" />
                        Remember me
                    </label>

                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <p className="text-center text-xs text-gray-500 mb-3">Demo Accounts</p>
                        <div className="grid grid-cols-2 gap-2">
                            {["owner", "manager", "employee", "client"].map(role => (
                                <button key={role} type="button" onClick={() => handleDemoLogin(role)}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 capitalize">
                                    {role} Demo
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-blue-600 hover:underline">Sign up here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;