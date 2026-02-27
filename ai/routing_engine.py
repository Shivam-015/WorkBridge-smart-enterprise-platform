def reroute_tasks(tasks, escalation_results, company_users):
    rerouted = []

    for result in escalation_results:
        if not result["escalate"]:
            continue

        task_id = result["task_id"]
        target_role = result["escalation_to"]

        possible_users = [
            user for user in company_users
            if user["role"] == target_role
        ]

        if possible_users:
            new_assignee = possible_users[0]

            rerouted.append({
                "task_id": task_id,
                "new_assigned_to": new_assignee["name"],
                "role": target_role,
                "reason": result["delay_risk"]
            })

    return rerouted