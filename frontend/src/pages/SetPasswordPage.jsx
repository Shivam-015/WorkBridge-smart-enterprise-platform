import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { postData } from "../lib/api";

export default function SetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invite token missing in URL.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await postData(`/set-password/${token}/`, {
        password,
        confirm_password: confirmPassword
      });
      setResult(res?.message || "Password set successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form onSubmit={submit} className="card w-full space-y-4">
        <h1 className="text-xl font-bold">Set Password</h1>
        <p className="text-xs text-slate-500">Invite link token: {token || "Missing"}</p>

        <div>
          <label className="label">New Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div>
          <label className="label">Confirm Password</label>
          <input
            className="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn-primary w-full" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
        <p className="text-sm text-slate-600">Already set? <Link to="/login" className="font-semibold text-brand-700">Login</Link></p>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {result ? <p className="text-sm text-emerald-700">{result}</p> : null}
      </form>
    </main>
  );
}