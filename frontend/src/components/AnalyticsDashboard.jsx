/**
 * AnalyticsDashboard.jsx
 * Fixed layout and alignment version.
 */

function DonutChart({ slices, size = 180, thickness = 34 }) {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = slices.reduce((acc, s) => acc + s.value, 0);

  let offset = 0;
  const paths = slices.map((slice) => {
    const pct = total ? slice.value / total : 0;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const el = (
      <circle
        key={slice.label}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={slice.color}
        strokeWidth={thickness}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      />
    );
    offset += dash;
    return el;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={thickness} />
      {paths}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="800" fill="#1e3a8a" fontFamily="Georgia, serif">
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8" letterSpacing="1">
        TOTAL
      </text>
    </svg>
  );
}

function BarChart({ bars, height = 180 }) {
  if (!bars.length) return <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>No data available.</p>;
  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  const barW = 48;
  const gap = 40;
  const paddingLeft = 32;
  const totalW = paddingLeft + bars.length * (barW + gap);

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <svg width={totalW} height={height + 100} style={{ display: "block", minWidth: "100%" }}>
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = 30 + (1 - pct) * height;
          return (
            <g key={pct}>
              <line x1={paddingLeft} y1={y} x2={totalW} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
              <text x={paddingLeft - 4} y={y + 4} fontSize="10" fill="#94a3b8" fontWeight="600" textAnchor="end">
                {Math.round(maxVal * pct)}
              </text>
            </g>
          );
        })}
        {bars.map((bar, i) => {
          const x = paddingLeft + i * (barW + gap);
          const barH = maxVal ? Math.max((bar.value / maxVal) * height, bar.value > 0 ? 4 : 0) : 0;
          const y = 30 + height - barH;
          return (
            <g key={bar.label}>
              <rect x={x} y={y} width={barW} height={barH} rx={5} fill={bar.color} opacity="0.88" />
              <text x={x + barW / 2} y={y - 10} textAnchor="middle" fontSize="12" fontWeight="800" fill={bar.color}>
                {bar.value}
              </text>
              <text x={x + barW / 2} y={height + 56} textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b"
                style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {bar.label.length > 8 ? bar.label.slice(0, 8) + "…" : bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ProgressBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a8a" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color, background: color + "15", padding: "2px 8px", borderRadius: 20 }}>
          {value}/{max} &nbsp;·&nbsp; {Math.round(pct)}%
        </span>
      </div>
      <div style={{ height: 10, borderRadius: 8, background: "#e2e8f0", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 8, background: color, transition: "width 0.7s ease" }} />
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, fullWidth = false }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #dbeafe",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(30,58,138,0.06)",
      display: "flex",
      flexDirection: "column",
      gridColumn: fullWidth ? "1 / -1" : undefined,
    }}>
      <div style={{
        padding: "20px 20px",
        borderBottom: "2px solid #2563eb",
        background: "linear-gradient(90deg, #2563eb12, #2563eb04)",
      }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: "#1e3a8a", fontFamily: "Georgia, serif", margin: 0 }}>{title}</p>
        {subtitle && <p style={{ fontSize: 11, color: "#94a3b8", margin: "3px 0 0", fontWeight: 600 }}>{subtitle}</p>}
      </div>
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
}

function Legend({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 16 }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 11, height: 11, borderRadius: 3, background: item.color, flexShrink: 0, display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>
            {item.label} <span style={{ color: item.color, fontWeight: 800 }}>({item.value})</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function StatStrip({ stats }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
      gap: 12,
    }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #dbeafe",
          borderLeft: `4px solid ${stat.color}`,
          padding: "16px 18px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(30,58,138,0.05)",
        }}>
          <div style={{
            position: "absolute", top: -12, right: -12,
            width: 44, height: 44, borderRadius: "50%",
            background: stat.color + "15", pointerEvents: "none"
          }} />
          <p style={{ fontSize: 10, fontWeight: 800, color: stat.color + "99", textTransform: "uppercase", letterSpacing: "1.2px", margin: 0 }}>
            {stat.label}
          </p>
          <p style={{ fontSize: 30, fontWeight: 900, color: stat.color, fontFamily: "Georgia, serif", margin: "6px 0 0" }}>
            {stat.value ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}

function getTaskMetrics(tasks) {
  const todayISO = new Date().toISOString().slice(0, 10);
  const arr = Array.isArray(tasks) ? tasks : [];
  const completed = arr.filter((t) => String(t?.status || "").toUpperCase() === "COMPLETED").length;
  const pending = arr.filter((t) => String(t?.status || "").toUpperCase() === "PENDING").length;
  const inProgress = arr.filter((t) => String(t?.status || "").toUpperCase() === "IN_PROGRESS").length;
  const overdue = arr.filter((t) => {
    const due = String(t?.due_date || "");
    const s = String(t?.status || "").toUpperCase();
    return due && due < todayISO && (s === "PENDING" || s === "IN_PROGRESS");
  }).length;
  return { total: arr.length, completed, pending, inProgress, overdue };
}

export default function AnalyticsDashboard({
  roleType,
  ownerTasks = [],
  employeeTasks = [],
  managerAllTasks = [],
  ownerProjects = [],
  managerProjects = [],
  employeeProjects = [],
  taskProgressRows = [],
  ownerOverview = {},
  managerOverview = {},
  hrOverview = {},
  employeeMetrics = {},
}) {
  const tasks =
    roleType === "owner" ? ownerTasks
    : roleType === "manager" ? managerAllTasks
    : roleType === "hr" ? []
    : employeeTasks;

  const projects =
    roleType === "owner" ? ownerProjects
    : roleType === "manager" ? managerProjects
    : employeeProjects;

  const metrics = getTaskMetrics(tasks);

  const donutSlices = [
    { label: "Completed", value: metrics.completed, color: "#16a34a" },
    { label: "In Progress", value: metrics.inProgress, color: "#0891b2" },
    { label: "Pending", value: metrics.pending, color: "#d97706" },
    { label: "Overdue", value: metrics.overdue, color: "#dc2626" },
  ].filter((s) => s.value > 0);

  const projectBars = projects.slice(0, 10).map((p) => {
    const raw = String(p?.progress || "0").replace("%", "").split("(")[0].trim();
    const val = parseInt(raw) || 0;
    const status = String(p?.status || "").toUpperCase();
    const color = status === "COMPLETED" ? "#16a34a" : status === "ON_HOLD" ? "#d97706" : "#2563eb";
    return { label: p?.name || "Project", value: val, color };
  }).filter((b) => b.label !== "Project");

  const priorityBars = [
    { label: "Critical", value: tasks.filter((t) => String(t?.priority || "").toUpperCase() === "CRITICAL").length, color: "#dc2626" },
    { label: "High", value: tasks.filter((t) => String(t?.priority || "").toUpperCase() === "HIGH").length, color: "#d97706" },
    { label: "Medium", value: tasks.filter((t) => String(t?.priority || "").toUpperCase() === "MEDIUM").length, color: "#2563eb" },
    { label: "Low", value: tasks.filter((t) => String(t?.priority || "").toUpperCase() === "LOW").length, color: "#16a34a" },
  ];

  const overviewStats =
    roleType === "owner" ? [
      { label: "Employees", value: ownerOverview.total_employees, color: "#2563eb" },
      { label: "Projects", value: ownerOverview.total_projects, color: "#7c3aed" },
      { label: "Tasks", value: ownerOverview.total_tasks, color: "#0891b2" },
      { label: "Completion %", value: ownerOverview.completion_rate, color: "#16a34a" },
    ]
    : roleType === "manager" ? [
      { label: "Projects", value: managerOverview.total_projects, color: "#2563eb" },
      { label: "Team Size", value: managerOverview.team_members_count, color: "#7c3aed" },
      { label: "Tasks", value: managerOverview.total_tasks, color: "#0891b2" },
      { label: "Completed", value: managerOverview.completed_tasks, color: "#16a34a" },
    ]
    : roleType === "hr" ? [
      { label: "Employees", value: hrOverview.total_employees, color: "#2563eb" },
      { label: "Present", value: hrOverview.attendance?.present, color: "#16a34a" },
      { label: "On Leave", value: hrOverview.attendance?.on_leave, color: "#d97706" },
      { label: "Pending Leaves", value: hrOverview.leave_summary?.pending, color: "#dc2626" },
    ]
    : [
      { label: "Total Tasks", value: employeeMetrics.total_tasks, color: "#2563eb" },
      { label: "Completed", value: employeeMetrics.completed_tasks, color: "#16a34a" },
      { label: "Pending", value: employeeMetrics.pending_tasks, color: "#d97706" },
      { label: "Overdue", value: employeeMetrics.overdue_tasks, color: "#dc2626" },
    ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{
        borderRadius: 16,
        background: "linear-gradient(135deg, #0a1a3e 0%, #1a3a8f 100%)",
        padding: "22px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: 60, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "2px", margin: 0 }}>
            Analytics Dashboard
          </p>
          <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "Georgia, serif", margin: "4px 0 0" }}>
            {roleType === "owner" ? "Company" : roleType === "manager" ? "Team" : roleType === "hr" ? "HR" : "My"} Overview
          </p>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 10,
          padding: "8px 18px",
          color: "#bfdbfe",
          fontSize: 13,
          fontWeight: 700,
        }}>
          📊 Live Data
        </div>
      </div>

      {/* Stat Strip */}
      <StatStrip stats={overviewStats} />

      {/* Row 1 — Donut + Priority Bar side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ChartCard title="Task Status Breakdown" subtitle="Distribution across all statuses">
          {donutSlices.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>No task data yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <DonutChart slices={donutSlices} size={160} thickness={30} />
              <Legend items={[
                { label: "Completed", value: metrics.completed, color: "#16a34a" },
                { label: "In Progress", value: metrics.inProgress, color: "#0891b2" },
                { label: "Pending", value: metrics.pending, color: "#d97706" },
                { label: "Overdue", value: metrics.overdue, color: "#dc2626" },
              ]} />
            </div>
          )}
        </ChartCard>

        <ChartCard title="Tasks by Priority" subtitle="How tasks are distributed across priority levels">
          <BarChart bars={priorityBars} height={180} />
        </ChartCard>
      </div>

      {/* Row 2 — Project Completion full width */}
      {projects.length > 0 && (
        <ChartCard title="Project Completion %" subtitle="Progress percentage per project">
          <BarChart bars={projectBars} height={180} />
          <Legend items={[
            { label: "Active", value: projects.filter((p) => String(p?.status || "").toUpperCase() === "ACTIVE").length, color: "#2563eb" },
            { label: "Completed", value: projects.filter((p) => String(p?.status || "").toUpperCase() === "COMPLETED").length, color: "#16a34a" },
            { label: "On Hold", value: projects.filter((p) => String(p?.status || "").toUpperCase() === "ON_HOLD").length, color: "#d97706" },
          ]} />
        </ChartCard>
      )}

      {/* Row 3 — Employee Task Progress (owner/manager only) */}
      {(roleType === "owner" || roleType === "manager") && taskProgressRows.length > 0 && (
        <ChartCard title="Employee Task Completion" subtitle="Individual progress per team member">
          {taskProgressRows.map((row) => {
            const total = row.tasks.length;
            const completed = row.tasks.filter((t) => String(t?.status || "").toUpperCase() === "COMPLETED").length;
            return (
              <ProgressBar
                key={row.employeeId}
                label={row.employeeName}
                value={completed}
                max={total}
                color={completed === total ? "#16a34a" : completed > total / 2 ? "#0891b2" : "#d97706"}
              />
            );
          })}
        </ChartCard>
      )}

      {/* HR specific */}
      {roleType === "hr" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          <ChartCard title="Attendance Breakdown" subtitle="Today's attendance status">
            <BarChart bars={[
              { label: "Present", value: hrOverview.attendance?.present ?? 0, color: "#16a34a" },
              { label: "Absent", value: hrOverview.attendance?.absent ?? 0, color: "#dc2626" },
              { label: "Half Day", value: hrOverview.attendance?.half_day ?? 0, color: "#d97706" },
              { label: "On Leave", value: hrOverview.attendance?.on_leave ?? 0, color: "#0891b2" },
            ]} height={160} />
          </ChartCard>
          <ChartCard title="Leave Summary" subtitle="Current leave request statuses">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <DonutChart size={160} thickness={30} slices={[
                { label: "Approved", value: hrOverview.leave_summary?.approved ?? 0, color: "#16a34a" },
                { label: "Pending", value: hrOverview.leave_summary?.pending ?? 0, color: "#d97706" },
                { label: "Rejected", value: hrOverview.leave_summary?.rejected ?? 0, color: "#dc2626" },
              ].filter((s) => s.value > 0)} />
              <Legend items={[
                { label: "Approved", value: hrOverview.leave_summary?.approved ?? 0, color: "#16a34a" },
                { label: "Pending", value: hrOverview.leave_summary?.pending ?? 0, color: "#d97706" },
                { label: "Rejected", value: hrOverview.leave_summary?.rejected ?? 0, color: "#dc2626" },
              ]} />
            </div>
          </ChartCard>
        </div>
      )}

      {/* Employee project progress */}
      {roleType === "employee" && employeeProjects.length > 0 && (
        <ChartCard title="My Project Progress" subtitle="Completion status across assigned projects">
          {employeeProjects.map((p) => {
            const raw = String(p?.progress || "0").replace("%", "").split("(")[0].trim();
            const val = parseInt(raw) || 0;
            return (
              <ProgressBar
                key={p.id}
                label={p.name || "Project"}
                value={val}
                max={100}
                color={val >= 100 ? "#16a34a" : val >= 50 ? "#0891b2" : "#d97706"}
              />
            );
          })}
        </ChartCard>
      )}

    </div>
  );
}
