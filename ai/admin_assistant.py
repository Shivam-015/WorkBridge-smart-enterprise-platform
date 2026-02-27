def admin_assistant(query, workload_data, escalation_data):
    query = query.lower()

    if "overloaded" in query:
        return workload_data["overloaded"]

    if "free" in query or "underutilized" in query:
        return workload_data["underutilized"]

    if "delayed" in query or "escalated" in query:
        return [t for t in escalation_data if t["escalate"]]

    return "Sorry, I couldn’t understand this admin query yet."