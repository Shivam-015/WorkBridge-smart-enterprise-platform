from datetime import datetime, date

def analyze_tasks(tasks):
    results = []
    today = date.today()

    for task in tasks:
        due_date = (
            datetime.strptime(task["due_date"], "%Y-%m-%d").date()
            if task.get("due_date")
            else None
        )

        status = task.get("status")
        progress = task.get("progress", 0)
        priority = task.get("priority")

        delay_risk = "Safe"
        escalate = False
        escalation_to = None
        reasons = []

        if status != "COMPLETED" and due_date:
            days_left = (due_date - today).days

            if days_left < 0:
                delay_risk = "High"
                escalate = True
                reasons.append("Task deadline passed")

            elif days_left <= 2 and progress < 40:
                delay_risk = "Medium"
                escalate = True
                reasons.append("Deadline very close and progress is low")

            elif days_left <= 5 and progress < 20:
                delay_risk = "Low"
                reasons.append("Task is slow moving")

        if escalate:
            if priority == "HIGH":
                escalation_to = "Manager"
            elif priority == "MEDIUM":
                escalation_to = "Team Lead"
            else:
                escalation_to = "Employee"

        results.append({
            "task_id": task["id"],
            "title": task["title"],
            "delay_risk": delay_risk,
            "escalate": escalate,
            "escalation_to": escalation_to,
            "reasons": reasons
        })

    return results