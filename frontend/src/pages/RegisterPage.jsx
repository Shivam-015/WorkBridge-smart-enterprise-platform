import { useState } from "react";
import { postData } from "../lib/api";

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
    <main className="mx-auto max-w-2xl px-4 py-8">
      <form onSubmit={submit} className="card grid gap-4">
        <h1 className="text-xl font-bold">Company Registration</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Owner Name</label>
            <input className="input" value={form.owner_name} onChange={(e) => setForm((s) => ({ ...s, owner_name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Owner Email</label>
            <input className="input" type="email" value={form.owner_email} onChange={(e) => setForm((s) => ({ ...s, owner_email: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Owner Password</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} required />
          </div>
        </div>

        <div className="h-px bg-slate-200" />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Company Name</label>
            <input className="input" value={form.company.name} onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, name: e.target.value } }))} required />
          </div>
          <div>
            <label className="label">Company Email</label>
            <input className="input" type="email" value={form.company.email} onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, email: e.target.value } }))} required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.company.phone} onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, phone: e.target.value } }))} required />
          </div>
          <div>
            <label className="label">Size</label>
            <input className="input" value={form.company.size} onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, size: e.target.value } }))} required />
          </div>
          <div className="md:col-span-2">
            <label className="label">Address</label>
            <textarea className="input min-h-24" value={form.company.address} onChange={(e) => setForm((s) => ({ ...s, company: { ...s.company, address: e.target.value } }))} />
          </div>
        </div>

        <button className="btn-primary" disabled={loading}>{loading ? "Submitting..." : "Register Company"}</button>
        <a href="/login" className="text-sm font-semibold text-brand-700">Back to login</a>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {result && <pre className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">{JSON.stringify(result, null, 2)}</pre>}
      </form>
    </main>
  );
}