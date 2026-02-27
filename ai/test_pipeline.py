from ai_pipeline import ai_task_pipeline

tasks = [
    {
        "id": 1,
        "title": "Prepare Client Report",
        "due_date": "2026-01-10",   
        "status": "IN_PROGRESS",
        "progress": 10,
        "priority": "HIGH"
    },
    {
        "id": 2,
        "title": "Update Website",
        "due_date": "2026-02-20",
        "status": "IN_PROGRESS",
        "progress": 70,
        "priority": "LOW"
    }
]

company_users = [
    {"id": 1, "name": "Rohit", "role": "Manager"},
    {"id": 2, "name": "Aman", "role": "Team Lead"},
    {"id": 3, "name": "Neha", "role": "Employee"},
]

result = ai_task_pipeline(tasks, company_users)

print("\nFINAL AI OUTPUT:")
print(result)