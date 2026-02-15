import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle, Workflow } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success', 'error', 'info'
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear message when user starts typing
        if (message) setMessage("");
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setMessage("Email and password are required");
            setMessageType("error");
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage("Please enter a valid email address");
            setMessageType("error");
            return false;
        }
        
        if (formData.password.length < 6) {
            setMessage("Password must be at least 6 characters");
            setMessageType("error");
            return false;
        }
        
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
                
                // Store user data
                if (rememberMe) {
                    localStorage.setItem("user", JSON.stringify(data.data));
                } else {
                    sessionStorage.setItem("user", JSON.stringify(data.data));
                }
                
                // Store token if provided
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                const role = data.data.role?.toLowerCase();
                
                // Add delay for showing success message
                setTimeout(() => {
                    // Role-based navigation
                    const roleRoutes = {
                        admin: "/admin",
                        employee: "/employee",
                        manager: "/manager",
                        client: "/client",
                        hr: "/hr",
                        recruiter: "/recruiter"
                    };
                    
                    const route = roleRoutes[role] || "/dashboard";
                    navigate(route);
                }, 1500);

            } else {
                setMessageType("error");
                setMessage(data.message || "Invalid credentials");
            }
        } catch (error) {
            setMessageType("error");
            
            // Handle different error scenarios
            if (error.response) {
                // Server responded with error
                setMessage(error.response.data?.message || "Invalid email or password");
            } else if (error.request) {
                // Request made but no response
                setMessage("Network error. Please check your connection.");
            } else {
                // Something else happened
                setMessage("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Quick demo login function
    const handleDemoLogin = (role) => {
        const demoCredentials = {
            admin: { email: "admin@workbridge.com", password: "admin123" },
            employee: { email: "employee@workbridge.com", password: "employee123" },
            manager: { email: "manager@workbridge.com", password: "manager123" },
            client: { email: "client@workbridge.com", password: "client123" }
        };
        
        if (demoCredentials[role]) {
            setFormData(demoCredentials[role]);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-gray-900/[0.02] -z-10" />
            
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md relative overflow-hidden">
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-4">
                        <Workflow className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Sign in to continue to WorkBridge
                    </p>
                </div>

                {/* Message Alert */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                            messageType === "success" 
                                ? "bg-green-50 text-green-700 border-l-4 border-green-500" 
                                : messageType === "error"
                                ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                                : "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        }`}
                    >
                        {messageType === "success" ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm">{message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="you@example.com"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Options */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-lg font-semibold transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    {/* Demo Login Options */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin("admin")}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                            >
                                Admin Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin("manager")}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                            >
                                Manager Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin("employee")}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                            >
                                Employee Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin("client")}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                            >
                                Client Demo
                            </button>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don't have an account?{" "}
                        <Link 
                            to="/register" 
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Sign up here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;