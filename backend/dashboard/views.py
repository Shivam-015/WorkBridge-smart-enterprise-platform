from django.utils import timezone
from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()

from projects.models import Project
from tasks.models import Task
from clients.models import Client


class AdminDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        if user.role != "ADMIN":
            return Response(
                {"error": "Only Admin can access dashboard"},
                status=403
            )

        company = user.company

        tasks = Task.objects.filter(company=company)

        # =========================
        # SUMMARY
        # =========================

        total_users = User.objects.filter(company=company).count()
        total_projects = Project.objects.filter(company=company).count()
        total_clients = Client.objects.filter(company=company).count()
        total_tasks = tasks.count()

        completed_tasks = tasks.filter(status="COMPLETED").count()

        pending_tasks = tasks.filter(
            Q(status="PENDING") | Q(status="IN_PROGRESS")
        ).count()

        summary = {
            "total_users": total_users,
            "total_projects": total_projects,
            "total_clients": total_clients,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks
        }

        # =========================
        # EMPLOYEE PERFORMANCE
        # =========================

        employees = User.objects.filter(
            company=company,
            role="EMPLOYEE"
        ).annotate(
            completed=Count(
                "assigned_tasks",
                filter=Q(
                    assigned_tasks__status="COMPLETED",
                    assigned_tasks__company=company
                )
            ),
            pending=Count(
                "assigned_tasks",
                filter=Q(
                    assigned_tasks__company=company
                ) & ~Q(assigned_tasks__status="COMPLETED")
            )
        )

        employee_performance = [
            {
                "name": emp.username,
                "completed": emp.completed,
                "pending": emp.pending
            }
            for emp in employees
        ]

        # =========================
        # TASK STATUS
        # =========================

        task_status = {
            "completed": completed_tasks,
            "pending": pending_tasks
        }

        # =========================
        # OVERDUE TASKS
        # =========================

        today = timezone.now().date()

        overdue_tasks = tasks.filter(
            due_date__isnull=False,
            due_date__lt=today
        ).exclude(status="COMPLETED").count()

        # =========================
        # RECENT ACTIVITY
        # =========================

        recent_tasks = tasks.select_related(
            "assigned_to"
        ).order_by("-created_at")[:5]

        recent_activity = []

        for task in recent_tasks:
            username = task.assigned_to.username if task.assigned_to else "User"

            if task.status == "COMPLETED":
                activity = f"{username} completed '{task.title}'"
            else:
                activity = f"{username} updated '{task.title}'"

            recent_activity.append(activity)

        # =========================
        # FINAL RESPONSE
        # =========================

        return Response({
            "summary": summary,
            "employee_performance": employee_performance,
            "task_status": task_status,
            "overdue_tasks": overdue_tasks,
            "recent_activity": recent_activity
        })