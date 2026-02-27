from datetime import datetime

def analyze_workflow_performance(tasks):
    completed_times = []
    slow_tasks = []

    for task in tasks:
        if task.get("status") == "COMPLETED" and task.get("created_at") and task.get("completed_at"):
            created_at = datetime.strptime(task["created_at"], "%Y-%m-%d")
            completed_at = datetime.strptime(task["completed_at"], "%Y-%m-%d")

            days_taken = (completed_at - created_at).days
            completed_times.append(days_taken)

            if days_taken > 5:
                slow_tasks.append({
                    "task_id": task["id"],
                    "title": task["title"],
                    "days_taken": days_taken
                })

    avg_time = sum(completed_times) / len(completed_times) if completed_times else 0

    return {
        "average_completion_time_days": round(avg_time, 2),
        "slow_tasks": slow_tasks
    }