import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getData, patchData } from "../lib/api";
import { useAuth } from "../lib/auth";
import {
  compactPayload,
  extractError,
  formatValue,
  getEntityId,
  mergeRowsById,
  toArray
} from "./detailHelpers";

function makeUserForm(userRow, roles) {
  const selectedRole = roles.find(
    (role) =>
      String(role?.id || "") === String(userRow?.role || "") ||
      String(role?.name || "").trim().toLowerCase() === String(userRow?.role || "").trim().toLowerCase()
  );

  return {
    name: String(userRow?.name || ""),
    role: String(selectedRole?.id || ""),
    status: String(userRow?.status || "ACTIVE")
  };
}

function taskUserMatches(task, userId) {
  const assignedId = String(getEntityId(task?.assigned_to) || "");
  return assignedId && assignedId === String(userId || "");
}

export default function UserDetailsPage() {
  const { userId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const roleName = String(user?.role || "").trim().toLowerCase();
  const routeUser = state?.user && String(state.user.id || "") === String(userId || "") ? state.user : null;

  const [userRow, setUserRow] = useState(routeUser);
  const [roles, setRoles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(makeUserForm(routeUser || {}, []));
  const [loading, setLoading] = useState(!routeUser);
  const [saving, setSaving] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [noticeText, setNoticeText] = useState("");

  useEffect(() => {
    let active = true;

    const fetchOptional = async (url, fallback = []) => {
      try {
        return await getData(url);
      } catch {
        return fallback;
      }
    };

    const loadPage = async () => {
      const targetId = String(userId || "").trim();
      if (!targetId) {
        if (!active) return;
        setErrorText("Invalid user id.");
        setLoading(false);
        return;
      }

      setLoading(!routeUser);
      setErrorText("");

      const userEndpoints = roleName.includes("manager") ? ["/team/"] : ["/users/", "/team/"];
      const taskEndpoints = roleName.includes("manager") ? ["/team-tasks/"] : ["/all-tasks/", "/team-tasks/"];

      const [rolesRes, taskRows] = await Promise.all([
        fetchOptional("/roles/", []),
        (async () => {
          for (const endpoint of taskEndpoints) {
            try {
              return await getData(endpoint);
            } catch {
              // try next endpoint
            }
          }
          return [];
        })()
      ]);

      if (!active) return;
      setRoles(toArray(rolesRes));
      setTasks(toArray(taskRows));

      if (routeUser) {
        setForm(makeUserForm(routeUser, toArray(rolesRes)));
      }

      for (const endpoint of userEndpoints) {
        try {
          const rows = await getData(endpoint);
          const matched = toArray(rows).find((row) => String(row?.id || "") === targetId);
          if (!matched) continue;
          if (!active) return;
          setUserRow(matched);
          setForm(makeUserForm(matched, toArray(rolesRes)));
          setLoading(false);
          return;
        } catch {
          // try next endpoint
        }
      }

      if (!active) return;
      setErrorText("User details not found or access denied.");
      setLoading(false);
    };

    loadPage();

    return () => {
      active = false;
    };
  }, [roleName, routeUser, userId]);

  const roleLookup = useMemo(() => {
    const lookup = {};
    for (const role of roles) {
      const id = String(role?.id || "");
      if (!id) continue;
      lookup[id] = role;
      const name = String(role?.name || "").trim().toLowerCase();
      if (name) lookup[`name:${name}`] = role;
    }
    return lookup;
  }, [roles]);

  const resolvedRole = useMemo(() => {
    const directId = String(form.role || userRow?.role || "").trim();
    if (!directId) return null;
    return roleLookup[directId] || roleLookup[`name:${directId.toLowerCase()}`] || null;
  }, [form.role, roleLookup, userRow]);

  const assignedTasks = useMemo(
    () => tasks.filter((task) => taskUserMatches(task, userId)),
    [tasks, userId]
  );

  const allFields = useMemo(() => {
    if (!userRow) return [];

    const normalized = {
      ...userRow,
      role: userRow?.role || resolvedRole?.name || "-",
      company: user?.company || "-",
      assigned_tasks: assignedTasks.length
    };

    return Object.entries(normalized).filter(([key]) => key !== "id");
  }, [assignedTasks.length, resolvedRole, user, userRow]);

  const submitUpdate = async (event) => {
    event.preventDefault();

    if (!userId) {
      setErrorText("User id missing.");
      return;
    }

    setSaving(true);
    setErrorText("");
    setNoticeText("");

    try {
      const payload = compactPayload({
        name: form.name.trim(),
        role: form.role,
        status: form.status
      });

      const updated = await patchData(`/update-user/${userId}/`, payload);
      setUserRow(updated);
      setForm(makeUserForm(updated, roles));
      setShowEditForm(false);
      setNoticeText("User updated.");
    } catch (error) {
      setErrorText(extractError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <section className="mx-auto max-w-6xl space-y-4">
        <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">User Details</p>
              <h1 className="text-2xl font-bold text-slate-900">{userRow?.name || "User"}</h1>
              <p className="mt-1 text-sm text-slate-500">Important list fields stay on the table. Full available details open here.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="btn-secondary" onClick={() => navigate(-1)}>
                Back
              </button>
              {!loading && !errorText && userRow ? (
                <button className="btn-primary" onClick={() => setShowEditForm((value) => !value)}>
                  {showEditForm ? "Close Update" : "Update User"}
                </button>
              ) : null}
            </div>
          </div>
        </header>

        {loading ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading user...</section>
        ) : null}

        {errorText ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{errorText}</section>
        ) : null}

        {noticeText ? (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{noticeText}</section>
        ) : null}

        {!loading && !errorText && userRow ? (
          <>
            <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Summary</h2>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p><span className="font-semibold">Name:</span> {userRow.name || "-"}</p>
                  <p><span className="font-semibold">Email:</span> {userRow.email || "-"}</p>
                  <p><span className="font-semibold">Role:</span> {userRow.role || resolvedRole?.name || "-"}</p>
                  <p><span className="font-semibold">Level:</span> {userRow.level ?? resolvedRole?.level ?? "-"}</p>
                  <p><span className="font-semibold">Status:</span> {userRow.status || "-"}</p>
                  <p><span className="font-semibold">Company:</span> {user?.company || "-"}</p>
                  <p><span className="font-semibold">Assigned Tasks:</span> {assignedTasks.length}</p>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Assigned Tasks</h2>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  {!assignedTasks.length ? <p className="text-slate-500">No assigned tasks found.</p> : null}
                  {assignedTasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-left hover:border-sky-300 hover:bg-sky-50"
                      onClick={() => navigate(`/task/${task.id}`, { state: { task } })}
                    >
                      <p className="font-semibold text-slate-900">{task.title || "Task"}</p>
                      <p className="mt-1 text-slate-600">Status: {task.status || "-"}</p>
                      <p className="text-slate-500">Due: {task.due_date || "-"}</p>
                    </button>
                  ))}
                </div>
              </article>
            </section>

            {showEditForm ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Update User</h2>
                <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submitUpdate}>
                  <label className="space-y-1 text-sm text-slate-700">
                    <span className="font-medium">Name</span>
                    <input className="input" value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} required />
                  </label>
                  <label className="space-y-1 text-sm text-slate-700">
                    <span className="font-medium">Role</span>
                    <select className="input" value={form.role} onChange={(event) => setForm((value) => ({ ...value, role: event.target.value }))} required>
                      <option value="">Select role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
                    <span className="font-medium">Status</span>
                    <select className="input" value={form.status} onChange={(event) => setForm((value) => ({ ...value, status: event.target.value }))}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INVITED">INVITED</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </label>
                  <button className="btn-primary md:col-span-2" disabled={saving}>{saving ? "Updating..." : "Update User"}</button>
                </form>
              </section>
            ) : null}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">All User Fields</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {allFields.map(([key, value]) => (
                  <article key={key} className="rounded border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{key}</p>
                    <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-slate-800">{formatValue(value)}</pre>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </section>
    </main>
  );
}
