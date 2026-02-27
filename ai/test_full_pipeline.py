from ai_pipeline import full_ai_pipeline

tasks = [
    {
        "id": 1,
        "title": "Prepare Client Report",
        "assigned_to": 1,
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "due_date": "2026-01-10",
        "progress": 10,
        "created_at": "2026-01-01",
        "completed_at": None
    },
    {
        "id": 2,
        "title": "Update Website",
        "assigned_to": 2,
        "status": "COMPLETED",
        "priority": "LOW",
        "due_date": "2026-02-10",
        "progress": 100,
        "created_at": "2026-02-01",
        "completed_at": "2026-02-05"
    }
]

company_users = [
    {"id": 1, "name": "Roy", "role": "Manager"},
    {"id": 2, "name": "Neha", "role": "Employee"}
]

result = full_ai_pipeline(tasks, company_users)
print(result)