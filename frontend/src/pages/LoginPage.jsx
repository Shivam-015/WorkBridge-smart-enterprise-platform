import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../lib/api";
import { useAuth } from "../lib/auth";
import logo from "./logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await postData("/login/", form);
      login(res);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.detail || JSON.stringify(err?.response?.data) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #e8eef8 0%, #dce6f5 60%, #c9d9f0 100%)" }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ border: "1px solid rgba(30,64,175,0.12)" }}
      >
        {/* Top blue banner with logo + title */}
        <div
          className="flex flex-col items-center px-8 pt-10 pb-8"
          style={{ background: "linear-gradient(135deg, #0a1a3e 0%, #0d2760 55%, #1a3a8f 100%)", borderBottom: "3px solid #1e4db7" }}
        >
          <img
            src={logo}
            alt="WorkBridge Logo"
            className="h-20 w-20 rounded-full object-cover mb-5"
            style={{ border: "3px solid rgba(255,255,255,0.3)", boxShadow: "0 0 0 5px rgba(255,255,255,0.08)" }}
          />
          <h1
            className="text-3xl font-extrabold text-white tracking-wide"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            WorkBridge
          </h1>
          <p className="mt-1.5 text-base font-semibold" style={{ color: "#93c5fd" }}>
            Company Dashboard
          </p>
        </div>

        {/* Form body */}
        <div className="bg-white px-8 py-8 space-y-5">
          <h2
            className="text-xl font-extrabold text-blue-900 text-center"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Sign in to your account
          </h2>

          <div>
            <label className="block text-sm font-bold text-blue-900 mb-1.5">Email Address</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-200 text-sm"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-blue-900 mb-1.5">Password</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-200 text-sm"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            className="w-full rounded-lg py-3 font-extrabold text-white transition disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #0d2760, #1d4ed8)", fontFamily: "'Georgia', serif", fontSize: "1rem", letterSpacing: "0.02em" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-sm text-slate-500">
            New company?{" "}
            <a href="/register" className="font-bold text-blue-800 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </form>
    </main>
  );
}
