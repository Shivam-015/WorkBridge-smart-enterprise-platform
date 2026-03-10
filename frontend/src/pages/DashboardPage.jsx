import { useMemo, useState } from "react";
import JsonViewer from "../components/JsonViewer";
import { getData, patchData, postData } from "../lib/api";
import { useAuth } from "../lib/auth";
import logo from "./logo.png";
const readEndpoints = [
  { label: "Current User", url: "/current-user/" },
  { label: "Overview", url: "/overview/" },
  { label: "My Tasks", url: "/my-tasks/" },
  { label: "My Projects", url: "/my-projects/" },
  { label: "My Leaves", url: "/my-leaves/" },
  { label: "Users", url: "/users/" },
  { label: "All Tasks", url: "/all-tasks/" },
  { label: "All Projects", url: "/all-projects/" },
  { label: "Manager Overview", url: "/manager-overview/" },
  { label: "Manager Team Tasks", url: "/all-tasks/" },
  { label: "Manager Team", url: "/team/" },
  { label: "HR Dashboard", url: "/hr-dashboard/" },
  { label: "Profile", url: "/profile/" },
  { label: "Attendance", url: "/attendance/" },
  { label: "Departments", url: "/departments/" },
  { label: "Tasks (CRUD)", url: "/tasks/" },
  { label: "Projects (CRUD)", url: "/projects/" },
  { label: "Companies", url: "/companies/" },
  { label: "Roles", url: "/roles/" }
];

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [responseMap, setResponseMap] = useState({});
  const [error, setError] = useState("");
  const [loadingKey, setLoadingKey] = useState("");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    project: "",
    due_date: "",
    priority: "MEDIUM"
  });

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    manager: "",
    client: "",
    status: "ACTIVE",
    priority: "MEDIUM",
    start_date: "",
    end_date: "",
    budget: "",
    actual_cost: ""
  });

  const [roleForm, setRoleForm] = useState({
    name: "",
    can_manage_company: false,
    can_manage_roles: false,
    can_manage_users: false,
    can_create_project: false,
    can_assign_task: false,
    can_view_all_tasks: false,
    can_view_team_tasks: false,
    can_view_assigned_tasks: true,
    can_update_task_status: true,
    can_view_project_progress: false,
    can_manage_hr: false,
    can_approve_leave: false,
    can_view_attendance: false,
    can_manage_payroll: false
  });

  const [inviteForm, setInviteForm] = useState({
    company_id: "",
    first_name: "",
    email: "",
    role_id: ""
  });

  const [leaveForm, setLeaveForm] = useState({ start_date: "", end_date: "", reason: "" });
  const [deptForm, setDeptForm] = useState({ name: "", description: "" });
  const [leavePatchForm, setLeavePatchForm] = useState({ leave_id: "", status: "APPROVED" });

  const flatResponses = useMemo(() => Object.entries(responseMap), [responseMap]);

  const fetchEndpoint = async (url) => {
    setError("");
    setLoadingKey(url);
    try {
      const data = await getData(url);
      setResponseMap((s) => ({ ...s, [url]: data }));
    } catch (err) {
      setError(`${url}: ${JSON.stringify(err?.response?.data || err.message)}`);
    } finally {
      setLoadingKey("");
    }
  };

  const submitTask = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...taskForm,
        assigned_to: Number(taskForm.assigned_to),
        project: Number(taskForm.project)
      };
      const data = await postData("/tasks/", payload);
      setResponseMap((s) => ({ ...s, taskCreate: data }));
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || err.message));
    }
  };

  const submitProject = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...projectForm,
        manager: projectForm.manager ? Number(projectForm.manager) : null,
        client: projectForm.client ? Number(projectForm.client) : null,
        budget: projectForm.budget ? Number(projectForm.budget) : null,
        actual_cost: projectForm.actual_cost ? Number(projectForm.actual_cost) : null
      };
      const data = await postData("/projects/", payload);
      setResponseMap((s) => ({ ...s, projectCreate: data }));
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || err.message));
    }
  };

  const submitRole = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await postData("/roles/", roleForm);
      setResponseMap((s) => ({ ...s, roleCreate: data }));
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || err.message));
    }
  };

  const submitInvite = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await postData("/create-user/", {
        ...inviteForm,
        company_id: Number(inviteForm.company_id),
        role_id: Number(inviteForm.role_id)
      });
      setResponseMap((s) => ({ ...s, userInvite: data }));
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || err.message));
    }
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await postData("/leave/apply/", leaveForm);
      setResponseMap((s) => ({ ...s, leaveApply: data }));
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || err.message));
    }
  };

  const submitDepartment = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await postData("/departments/", deptForm);
      setResponseMap((s) => ({ ...s, departmentCreate: data }));
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || err.message));
    }
  };

  const submitLeavePatch = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await patchData(`/leave/${leavePatchForm.leave_id}/status/`, { status: leavePatchForm.status });
      setResponseMap((s) => ({ ...s, leaveStatusPatch: data }));
    } catch (err) {
      setError(JSON.stringify(err?.response?.data || err.message));
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-6" style={{ background: "linear-gradient(135deg, #e8eef8 0%, #dce6f5 100%)" }}>
      <header className="mb-6 flex flex-col gap-3 rounded-2xl p-5 text-white shadow-lg md:flex-row md:items-center md:justify-between" style={{ background: "linear-gradient(135deg, #0a1a3e 0%, #0d2760 50%, #1a3a8f 100%)", borderBottom: "3px solid #1e4db7" }}>
        <div className="flex items-center gap-4">
          <img src={logo} alt="WorkBridge" style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)", boxShadow: "0 0 0 4px rgba(30,77,183,0.3)" }} />
          <div>
            <h1 className="text-3xl font-extrabold tracking-wide" style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.01em" }}>WorkBridge</h1>
            <p className="text-sm font-semibold" style={{ color: "#93c5fd" }}>Welcome back, {user?.name || user?.email || "User"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg px-4 py-2 text-sm font-semibold transition" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }} onClick={() => fetchEndpoint("/current-user/")}>Refresh User</button>
          <button className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-white/20" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }} onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="card mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-extrabold text-blue-900" style={{ fontFamily: "'Georgia', serif" }}>Quick API Reads</h2>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {readEndpoints.map((item) => (
            <button
              key={item.url}
              className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-left text-sm font-medium text-blue-900 transition hover:bg-blue-100 hover:border-blue-300 disabled:opacity-60"
              onClick={() => fetchEndpoint(item.url)}
              disabled={loadingKey === item.url}
            >
              {loadingKey === item.url ? "Loading..." : item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <form onSubmit={submitTask} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-extrabold text-blue-900" style={{ fontFamily: "'Georgia', serif" }}>Create Task (`POST /tasks/`)</h3>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="title" value={taskForm.title} onChange={(e) => setTaskForm((s) => ({ ...s, title: e.target.value }))} required />
          <textarea className="input min-h-20" placeholder="description" value={taskForm.description} onChange={(e) => setTaskForm((s) => ({ ...s, description: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-2">
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="assignee" value={taskForm.assigned_to} onChange={(e) => setTaskForm((s) => ({ ...s, assigned_to: e.target.value }))} required />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="project" value={taskForm.project} onChange={(e) => setTaskForm((s) => ({ ...s, project: e.target.value }))} required />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" type="date" value={taskForm.due_date} onChange={(e) => setTaskForm((s) => ({ ...s, due_date: e.target.value }))} />
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" value={taskForm.priority} onChange={(e) => setTaskForm((s) => ({ ...s, priority: e.target.value }))}>
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
            </select>
          </div>
          <button className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60">Create Task</button>
        </form>

        <form onSubmit={submitProject} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-extrabold text-blue-900" style={{ fontFamily: "'Georgia', serif" }}>Create Project (`POST /projects/`)</h3>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="name" value={projectForm.name} onChange={(e) => setProjectForm((s) => ({ ...s, name: e.target.value }))} required />
          <textarea className="input min-h-20" placeholder="description" value={projectForm.description} onChange={(e) => setProjectForm((s) => ({ ...s, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="manager" value={projectForm.manager} onChange={(e) => setProjectForm((s) => ({ ...s, manager: e.target.value }))} />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="client" value={projectForm.client} onChange={(e) => setProjectForm((s) => ({ ...s, client: e.target.value }))} />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" type="date" value={projectForm.start_date} onChange={(e) => setProjectForm((s) => ({ ...s, start_date: e.target.value }))} required />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" type="date" value={projectForm.end_date} onChange={(e) => setProjectForm((s) => ({ ...s, end_date: e.target.value }))} />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="budget" value={projectForm.budget} onChange={(e) => setProjectForm((s) => ({ ...s, budget: e.target.value }))} />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="actual_cost" value={projectForm.actual_cost} onChange={(e) => setProjectForm((s) => ({ ...s, actual_cost: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" value={projectForm.status} onChange={(e) => setProjectForm((s) => ({ ...s, status: e.target.value }))}>
              <option>ACTIVE</option>
              <option>COMPLETED</option>
              <option>ON_HOLD</option>
            </select>
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" value={projectForm.priority} onChange={(e) => setProjectForm((s) => ({ ...s, priority: e.target.value }))}>
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
              <option>CRITICAL</option>
            </select>
          </div>
          <button className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60">Create Project</button>
        </form>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <form onSubmit={submitRole} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-extrabold text-blue-900" style={{ fontFamily: "'Georgia', serif" }}>Create Role (`POST /roles/`)</h3>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="Role name" value={roleForm.name} onChange={(e) => setRoleForm((s) => ({ ...s, name: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.keys(roleForm)
              .filter((k) => k !== "name")
              .map((key) => (
                <label key={key} className="flex items-center gap-2 rounded border border-slate-200 p-2">
                  <input
                    type="checkbox"
                    checked={Boolean(roleForm[key])}
                    onChange={(e) => setRoleForm((s) => ({ ...s, [key]: e.target.checked }))}
                  />
                  <span className="text-xs">{key}</span>
                </label>
              ))}
          </div>
          <button className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60">Create Role</button>
        </form>

        <div className="space-y-4">
          <form onSubmit={submitInvite} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-lg font-extrabold text-blue-900" style={{ fontFamily: "'Georgia', serif" }}>Invite User (`POST /create-user/`)</h3>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="company_id" value={inviteForm.company_id} onChange={(e) => setInviteForm((s) => ({ ...s, company_id: e.target.value }))} required />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="first_name" value={inviteForm.first_name} onChange={(e) => setInviteForm((s) => ({ ...s, first_name: e.target.value }))} required />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="email" type="email" value={inviteForm.email} onChange={(e) => setInviteForm((s) => ({ ...s, email: e.target.value }))} required />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="role_id" value={inviteForm.role_id} onChange={(e) => setInviteForm((s) => ({ ...s, role_id: e.target.value }))} required />
            <button className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60">Send Invite</button>
          </form>

          <form onSubmit={submitLeave} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-lg font-extrabold text-blue-900" style={{ fontFamily: "'Georgia', serif" }}>Apply Leave (`POST /leave/apply/`)</h3>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" type="date" value={leaveForm.start_date} onChange={(e) => setLeaveForm((s) => ({ ...s, start_date: e.target.value }))} required />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" type="date" value={leaveForm.end_date} onChange={(e) => setLeaveForm((s) => ({ ...s, end_date: e.target.value }))} required />
            <textarea className="input min-h-20" placeholder="reason" value={leaveForm.reason} onChange={(e) => setLeaveForm((s) => ({ ...s, reason: e.target.value }))} required />
            <button className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60">Apply</button>
          </form>
        </div>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <form onSubmit={submitDepartment} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-extrabold text-blue-900" style={{ fontFamily: "'Georgia', serif" }}>Create Department (`POST /departments/`)</h3>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="name" value={deptForm.name} onChange={(e) => setDeptForm((s) => ({ ...s, name: e.target.value }))} required />
          <textarea className="input min-h-20" placeholder="description" value={deptForm.description} onChange={(e) => setDeptForm((s) => ({ ...s, description: e.target.value }))} />
          <button className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60">Create Department</button>
        </form>

        <form onSubmit={submitLeavePatch} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-extrabold text-blue-900" style={{ fontFamily: "'Georgia', serif" }}>Update Leave Status (`PATCH /leave/:id/status/`)</h3>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" placeholder="leave_id" value={leavePatchForm.leave_id} onChange={(e) => setLeavePatchForm((s) => ({ ...s, leave_id: e.target.value }))} required />
          <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200" value={leavePatchForm.status} onChange={(e) => setLeavePatchForm((s) => ({ ...s, status: e.target.value }))}>
            <option>APPROVED</option>
            <option>REJECTED</option>
            <option>PENDING</option>
          </select>
          <button className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60">Update Status</button>
        </form>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {flatResponses.length === 0 ? (
          <div className="card text-sm text-slate-500">No API output yet. Click a quick-read button or submit a form.</div>
        ) : (
          flatResponses.map(([key, value]) => <JsonViewer key={key} title={key} data={value} />)
        )}
      </section>
    </main>
  );
}
