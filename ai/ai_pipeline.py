from delay_escalation_engine import analyze_tasks
from routing_engine import reroute_tasks
from workload_engine import analyze_workload
from workflow_analytics_engine import analyze_workflow_performance

def full_ai_pipeline(tasks, company_users):
    escalation_results = analyze_tasks(tasks)
    reroute_results = reroute_tasks(tasks, escalation_results, company_users)
    workload_results = analyze_workload(tasks, company_users)
    workflow_results = analyze_workflow_performance(tasks)

    return {
        "escalations": escalation_results,
        "reroutes": reroute_results,
        "workload": workload_results,
        "workflow_insights": workflow_results
    }