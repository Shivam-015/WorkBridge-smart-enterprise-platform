export default function DataTable({ columns, rows, emptyText = "No data available", onRowClick }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
        {emptyText}
      </div>
    );
  }

  const rowClickable = typeof onRowClick === "function";
  const visibleColumns = Array.isArray(columns)
    ? columns.filter((column) => {
        const key = String(column?.key || "").trim().toLowerCase();
        const label = String(column?.label || "").trim().toLowerCase();
        return key !== "id" && label !== "id";
      })
    : [];

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              Serial No
            </th>
            {visibleColumns.map((column) => (
              <th
                key={column.key}
                className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={rowClickable ? "cursor-pointer transition hover:bg-slate-50" : ""}
              onClick={rowClickable ? () => onRowClick(row, rowIndex) : undefined}
            >
              <td className="whitespace-nowrap px-3 py-2 align-top text-slate-700">{rowIndex + 1}</td>
              {visibleColumns.map((column) => (
                <td key={`${row.id || rowIndex}-${column.key}`} className="max-w-xs px-3 py-2 align-top text-slate-700">
                  {column.render ? column.render(row[column.key], row, rowIndex) : String(row[column.key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
