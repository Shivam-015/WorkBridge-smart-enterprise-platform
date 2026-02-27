from routing_engine import reroute_tasks

tasks = [
    {
        "id": 1,
        "assigned_to": {"id": 10, "name": "Dev A", "role_level": 10}
    }
]

escalation_results = [
    {"task_id": 1, "delay_risk": "High", "escalate": True}
]

company_users = [
    {"id": 10, "name": "Dev A", "role_level": 10},
    {"id": 20, "name": "Team Lead", "role_level": 50},
    {"id": 30, "name": "Manager", "role_level": 80}
]

print(reroute_tasks(tasks, escalation_results, company_users))