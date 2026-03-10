import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../lib/api";
import { useAuth } from "../lib/auth";
import logo from "./logo.png";

const FEATURES = [
  ["Live dashboards", "Real-time project and team health"],
  ["Pending approvals", "Act on requests without switching tabs"],
  ["Team visibility", "See who's working on what, right now"],
];

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
      setError(
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between px-14 py-14"
        style={{ background: "linear-gradient(160deg,#07101f,#0f2251 55%,#1a3a6e)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div style={{ padding: 4, borderRadius: "50%", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", boxShadow: "0 0 0 3px rgba(255,255,255,0.12), 0 4px 16px rgba(30,58,138,0.4)" }}>
            <img src={logo} alt="WorkBridge" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2.5px solid #fff", display: "block" }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.01em" }}>WorkBridge</p>
            <p className="text-sm text-white/50 tracking-wide">Enterprise Platform</p>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-400 mb-5">Workspace</p>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-5" style={{ fontFamily: "'Georgia', serif" }}>
            Your operations,<br />
            <span style={{ background: "linear-gradient(135deg,#60a5fa,#93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              always in motion.
            </span>
          </h1>
          <p className="text-base text-white/50 leading-relaxed max-w-xs mb-10">
            Projects, approvals, attendance, and team visibility — all in one place.
          </p>
          <div className="flex flex-col gap-5">
            {FEATURES.map(([title, desc]) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" style={{ boxShadow: "0 0 8px rgba(59,130,246,.7)" }} />
                <p className="text-base text-white/70">
                  <span className="text-white font-semibold">{title}</span> — {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats footer */}
        <div className="flex items-center gap-8 pt-6 border-t border-white/10">
          {[["120+", "Teams active"], ["82%", "On track"], ["14", "Approvals"]].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="text-xl font-bold text-white tracking-tight">{val}</p>
              <p className="text-xs text-white/35 mt-0.5">{lbl}</p>
            </div>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: "0 0 6px rgba(74,222,128,.8)" }} />
            <span className="text-xs text-white/35">Live</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex items-center justify-center px-8 py-12 bg-white border-l-4 border-blue-600">
        <form onSubmit={submit} className="w-full max-w-sm flex flex-col gap-6">

          {/* Logo + Heading */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4" style={{ padding: 4, borderRadius: "50%", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", boxShadow: "0 4px 18px rgba(30,58,138,0.3)" }}>
              <img src={logo} alt="WorkBridge" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2.5px solid #fff", display: "block" }} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-1">Use your company email to continue.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">Email</label>
              <input
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition"
                type="email"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">Password</label>
              <input
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition"
                type="password"
                value={form.password}
                onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                required
              />
            </div>
            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
            )}
          </div>

          <button
            className="w-full py-3 text-sm font-semibold text-white rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", boxShadow: "0 4px 14px rgba(37,99,235,.35)" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-slate-500 text-center">
            New company?{" "}
            <a href="/register" className="font-semibold text-blue-600 hover:underline">Register here</a>
          </p>
        </form>
      </div>

    </main>
  );
}
