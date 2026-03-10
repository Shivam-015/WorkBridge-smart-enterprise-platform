import { useState } from "react";
import { postData } from "../lib/api";
import logo from "./logo.png";

const defaultPayload = {
  owner_name: "",
  owner_email: "",
  password: "",
  company: {
    name: "",
    email: "",
    phone: "",
    size: "",
    address: ""
  }
};

export default function RegisterPage() {
  const [form, setForm] = useState(defaultPayload);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await postData("/register/", form);
      setResult(res);
      setForm(defaultPayload);
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-200";
  const labelCls = "block text-sm font-bold text-blue-900 mb-1.5";

  return (
    <main
      className="flex min-h-screen flex-col items-center px-4 py-10"
      style={{ background: "linear-gradient(160deg, #e8eef8 0%, #dce6f5 60%, #c9d9f0 100%)" }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden bg-white"
        style={{ border: "1px solid rgba(30,64,175,0.15)" }}
      >
        {/* Logo + title area — light background */}
        <div
          className="flex flex-col items-center px-8 pt-10 pb-7"
          style={{ background: "linear-gradient(160deg, #f0f5ff 0%, #e8eef8 100%)", borderBottom: "2px solid #dbeafe" }}
        >
          <div
            className="mb-5"
            style={{ padding: 5, borderRadius: "50%", background: "linear-gradient(135deg, #1e3a8a, #2563eb)", boxShadow: "0 4px 18px rgba(30,58,138,0.25)" }}
          >
            <img
              src={logo}
              alt="WorkBridge Logo"
              className="h-20 w-20 rounded-full object-cover block"
              style={{ border: "3px solid #fff" }}
            />
          </div>
          <h1
            className="text-3xl font-extrabold text-blue-900 tracking-wide"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            WorkBridge
          </h1>
          <p className="mt-1.5 text-base font-semibold text-blue-600">
            Create your company account
          </p>
        </div>

        {/* Form body */}
        <form onSubmit={submit} className="bg-white px-8 py-8 space-y-6">
          {/* Owner Details */}
          <div>
            <h2
              className="text-lg font-extrabold text-blue-900 mb-4 pb-2"
              style={{ fontFamily: "'Georgia', serif", borderBottom: "2px solid #dbeafe" }}
            >
              Owner Details
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls}>Owner Name</label>
                <input
                  className={inputCls}
                  placeholder="Full name"
                  value={form.owner_name}
                  onChange={(e) => setForm((s) => ({ ...s, owner_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Owner Email</label>
                <input
                  className={inputCls}
                  type="email"
                  placeholder="owner@company.com"
                  value={form.owner_email}
                  onChange={(e) => setForm((s) => ({ ...s, owner_email: e.target.value }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Password</label>
                <input
                  className={inputCls}
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div>
            <h2
              className="text-lg font-extrabold text-blue-900 mb-4 pb-2"
              style={{ fontFamily: "'Georgia', serif", borderBottom: "2px solid #dbeafe" }}
            >
              Company Details
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls}>Company Name</label>
                <input
                  className={inputCls}
                  placeholder="Acme Inc."
                  value={form.company.name}
                  onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, name: e.target.value } }))}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Company Email</label>
                <input
                  className={inputCls}
                  type="email"
                  placeholder="hello@company.com"
                  value={form.company.email}
                  onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, email: e.target.value } }))}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  className={inputCls}
                  placeholder="+1 234 567 8900"
                  value={form.company.phone}
                  onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, phone: e.target.value } }))}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Company Size</label>
                <input
                  className={inputCls}
                  placeholder="e.g. 50"
                  value={form.company.size}
                  onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, size: e.target.value } }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Address</label>
                <textarea
                  className={inputCls + " min-h-24 resize-none"}
                  placeholder="123 Business Ave, City, Country"
                  value={form.company.address}
                  onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, address: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {result && (
            <pre className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}

          <button
            className="w-full rounded-lg py-3 font-extrabold text-white transition disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #0d2760, #1d4ed8)", fontFamily: "'Georgia', serif", fontSize: "1rem", letterSpacing: "0.02em" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Company"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already registered?{" "}
            <a href="/login" className="font-bold text-blue-800 hover:underline">
              Back to Login
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
