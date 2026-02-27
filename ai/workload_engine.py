def analyze_workload(tasks, company_users):
    workload = {}

    for user in company_users:
        workload[user["id"]] = {
            "user_id": user["id"],
            "name": user["name"],
            "role": user["role"],
            "total_tasks": 0,
            "completed": 0,
            "pending": 0
        }

    for task in tasks:
        user_id = task.get("assigned_to")

        if user_id in workload:
            workload[user_id]["total_tasks"] += 1

            if task.get("status") == "COMPLETED":
                workload[user_id]["completed"] += 1
            else:
                workload[user_id]["pending"] += 1

    overloaded = []
    underutilized = []

    for user in workload.values():
        if user["pending"] >= 5:
            overloaded.append(user)
        elif user["pending"] <= 1:
            underutilized.append(user)

    return {
        "workload_summary": list(workload.values()),
        "overloaded_users": overloaded,
        "underutilized_users": underutilized
    }