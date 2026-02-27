from delay_escalation_engine import analyze_tasks

tasks = [
    {
        "id": 1,
        "title": "Prepare report",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "due_date": "2026-02-20",
        "progress": 10
    },
    {
        "id": 2,
        "title": "Upload documents",
        "status": "PENDING",
        "priority": "LOW",
        "due_date": "2026-03-10",
        "progress": 5
    }
]

result = analyze_tasks(tasks)
print(result)