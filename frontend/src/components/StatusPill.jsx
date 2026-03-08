const toneByValue = {
  PENDING: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-sky-100 text-sky-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INVITED: "bg-violet-100 text-violet-700",
  INACTIVE: "bg-slate-200 text-slate-700",
  ON_HOLD: "bg-orange-100 text-orange-700",
  ABSENT: "bg-rose-100 text-rose-700",
  PRESENT: "bg-emerald-100 text-emerald-700",
  HALF_DAY: "bg-yellow-100 text-yellow-700"
};

export default function StatusPill({ value }) {
  const text = String(value || "-");
  const classes = toneByValue[text] || "bg-slate-100 text-slate-700";

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${classes}`}>{text}</span>;
}