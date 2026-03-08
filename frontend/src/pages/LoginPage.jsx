import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../lib/api";
import { useAuth } from "../lib/auth";

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
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form onSubmit={submit} className="card w-full space-y-4">
        <h1 className="text-xl font-bold">Login</h1>
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        <p className="text-sm text-slate-600">
          New company? <a href="/register" className="font-semibold text-brand-700">Register here</a>
        </p>
      </form>
    </main>
  );
}