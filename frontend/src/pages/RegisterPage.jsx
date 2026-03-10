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

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-100/70 px-4 py-10">

      {/* Logo */}
      <div className="mb-4 flex justify-center">
        <img
          src={logo}
          alt="WorkBridge Logo"
          className="h-28 w-28 rounded-full border-4 border-blue-700 shadow-lg object-cover"
        />
      </div>

      {/* Heading */}
      <h1 className="mb-8 text-4xl font-extrabold text-blue-900">
        Register for WorkBridge
      </h1>

      <form onSubmit={submit} className="w-full max-w-2xl grid gap-4 rounded-xl border border-slate-200 bg-white/70 p-8 shadow-xl backdrop-blur-md">

        <h2 className="text-xl font-bold text-blue-900">Company Registration</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label text-slate-700">Owner Name</label>
            <input className="input w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
              value={form.owner_name}
              onChange={(e) => setForm((s) => ({ ...s, owner_name: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label text-slate-700">Owner Email</label>
            <input className="input w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
              type="email"
              value={form.owner_email}
              onChange={(e) => setForm((s) => ({ ...s, owner_email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label text-slate-700">Owner Password</label>
            <input className="input w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
              type="password"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="h-px bg-slate-200" />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label text-slate-700">Company Name</label>
            <input className="input w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
              value={form.company.name}
              onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, name: e.target.value } }))}
              required
            />
          </div>

          <div>
            <label className="label text-slate-700">Company Email</label>
            <input className="input w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
              type="email"
              value={form.company.email}
              onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, email: e.target.value } }))}
              required
            />
          </div>

          <div>
            <label className="label text-slate-700">Phone</label>
            <input className="input w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
              value={form.company.phone}
              onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, phone: e.target.value } }))}
              required
            />
          </div>

          <div>
            <label className="label text-slate-700">Size</label>
            <input className="input w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
              value={form.company.size}
              onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, size: e.target.value } }))}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="label text-slate-700">Address</label>
            <textarea className="input min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
              value={form.company.address}
              onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, address: e.target.value } }))}
            />
          </div>
        </div>

        <button className="w-full rounded-lg bg-blue-800 py-2.5 font-semibold text-white hover:bg-blue-900 transition"
          disabled={loading}>
          {loading ? "Submitting..." : "Register Company"}
        </button>

        <a href="/login" className="text-sm font-semibold text-blue-700 hover:underline">
          Back to login
        </a>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {result && (
          <pre className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </form>
    </main>
  );
}