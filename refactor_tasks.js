const fs = require('fs');

let code = fs.readFileSync('frontend/src/pages/ManagerDashboardPage.jsx', 'utf8');

// 1. Remove New Task section in owner-tasks
code = code.replace(
  /<section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">\s*<SectionTitle title="New Task" \/>\s*\{permissions\.can_assign_task \? \([\s\S]*?<\/form>\s*\) : \(\s*<p className="text-sm text-slate-500">You do not have permission to create tasks\.<\/p>\s*\)\}\s*<\/section>/,
  ''
);

// 2. Remove New Task section in manager-tasks
code = code.replace(
  /<section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">\s*<SectionTitle title="New Task" \/>\s*<form className="grid gap-3 md:grid-cols-2" onSubmit=\{submitCreateTask\}>[\s\S]*?<\/form>\s*<\/section>/,
  ''
);

// 3. Update All Tasks SectionTitle to include New Task button (owner-tasks)
code = code.replace(
  /<SectionTitle title="All Tasks" \/>\s*<DataTable columns=\{dashboardTaskListColumns\} rows=\{ownerTasks\}/,
  `<SectionTitle 
                  title="All Tasks" 
                  action={
                    permissions.can_assign_task && (
                      <button 
                        onClick={() => setShowCreateTaskModal(true)}
                        className="btn-primary !py-2 !px-4 text-xs"
                      >
                        New Task
                      </button>
                    )
                  }
                />
                <DataTable columns={dashboardTaskListColumns} rows={ownerTasks}`
);

// 4. Update All Tasks SectionTitle to include New Task button (manager-tasks)
code = code.replace(
  /<SectionTitle title="All Tasks" \/>\s*<DataTable columns=\{managerTaskColumns\} rows=\{managerTaskRows\}/,
  `<SectionTitle 
                  title="All Tasks" 
                  action={
                    <button 
                      onClick={() => setShowCreateTaskModal(true)}
                      className="btn-primary !py-2 !px-4 text-xs"
                    >
                      New Task
                    </button>
                  }
                />
                <DataTable columns={managerTaskColumns} rows={managerTaskRows}`
);

// 5. Add CreateTaskModal at the bottom, just above AddProjectModal
const createTaskModalStr = `
  function CreateTaskModal() {
    return (
      <Modal isOpen={showCreateTaskModal} onClose={() => setShowCreateTaskModal(false)} title="Create New Task">
        <form className="grid gap-4" onSubmit={submitCreateTask}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Title</span>
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" value={createTaskForm.title} onChange={(e) => setCreateTaskForm((s) => ({ ...s, title: e.target.value }))} required />
            </div>
            
            <div className="space-y-1.5">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Assign To</span>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" value={createTaskForm.assigned_to} onChange={(e) => setCreateTaskForm((s) => ({ ...s, assigned_to: e.target.value }))} required>
                <option value="">Select employee</option>
                {createTaskAssigneeOptions.map((option) => (<option key={option.id} value={option.id}>{option.label}</option>))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Project</span>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" value={createTaskForm.project} onChange={(e) => setCreateTaskForm((s) => ({ ...s, project: e.target.value }))}>
                <option value="">None (No Project)</option>
                {createTaskProjectOptions.map((option) => (<option key={option.id} value={option.id}>{option.label}</option>))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Due Date</span>
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" type="date" value={createTaskForm.due_date} onChange={(e) => setCreateTaskForm((s) => ({ ...s, due_date: e.target.value }))} required />
            </div>
            
            <div className="space-y-1.5">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Status</span>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" value={createTaskForm.status} onChange={(e) => setCreateTaskForm((s) => ({ ...s, status: e.target.value }))}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Priority</span>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" value={createTaskForm.priority} onChange={(e) => setCreateTaskForm((s) => ({ ...s, priority: e.target.value }))}>
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Progress</span>
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" value={createTaskForm.progress} onChange={(e) => setCreateTaskForm((s) => ({ ...s, progress: e.target.value }))} required />
            </div>
            
            <div className="space-y-1.5 md:col-span-2">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Reference Link</span>
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" value={createTaskForm.reference_link} onChange={(e) => setCreateTaskForm((s) => ({ ...s, reference_link: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Attachment</span>
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" type="file" onChange={(e) => setCreateTaskForm((s) => ({ ...s, attachment: e.target.files?.[0] || null }))} />
            </div>
            
            <div className="space-y-1.5">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Image</span>
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" type="file" accept="image/*" onChange={(e) => setCreateTaskForm((s) => ({ ...s, image: e.target.files?.[0] || null }))} />
            </div>
            
            <div className="space-y-1.5 md:col-span-2">
              <span className="block text-sm font-bold text-blue-900/60 uppercase tracking-wider text-[10px]">Description</span>
              <textarea className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[100px]" value={createTaskForm.description} onChange={(e) => setCreateTaskForm((s) => ({ ...s, description: e.target.value }))} required />
            </div>
          </div>
          
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={() => setShowCreateTaskModal(false)} className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-all">Cancel</button>
            <button type="submit" className="flex-[2] btn-primary py-3" disabled={busyKey === "create-task"}>{busyKey === "create-task" ? "Saving..." : "Create Task"}</button>
          </div>
        </form>
      </Modal>
    );
  }

  function AddProjectModal() {`;

code = code.replace('  function AddProjectModal() {', createTaskModalStr);

fs.writeFileSync('frontend/src/pages/ManagerDashboardPage.jsx', code);
console.log("Refactoring complete");
