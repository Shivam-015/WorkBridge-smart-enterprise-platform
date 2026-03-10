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
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100/70 backdrop-blur-sm px-4">

      {/* Logo */}
      <div className="mb-6 flex items-center justify-center">
        <img
          src={logo}
          alt="WorkBridge Logo"
          className="h-28 w-28 rounded-full shadow-md object-cover"
        />
      </div>

      {/* Heading */}
      <h1 className="mb-10 text-4xl font-extrabold tracking-wide text-blue-900">
        Welcome to WorkBridge
      </h1>

      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-xl border border-slate-200 bg-white/70 p-8 shadow-xl backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-900">
          Company Dashboard Login
        </h2>

        <div>
          <label className="label text-slate-700 font-medium">Email</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
            type="email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="label text-slate-700 font-medium">Password</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
            type="password"
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          className="w-full rounded-lg bg-blue-800 py-2.5 font-semibold text-white transition hover:bg-blue-900 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-slate-600">
          New company?{" "}
          <a href="/register" className="font-semibold text-blue-800 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </main>
  );
}