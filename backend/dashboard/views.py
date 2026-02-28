from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from companies.utils import get_company_user, get_permission_dict
from companies.models import CompanyUser
from projects.models import Project
from tasks.models import Task
from hr.models import LeaveRequest
from datetime import timedelta
from django.db.models import Q

from .serializers import (
    OverviewSerializer,
    UserSerializer,
    ProjectSerializer,
    TaskSerializer,
    LeaveSerializer,
)

class DashboardOverviewAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        company_user = get_company_user(request.user)
        permissions = get_permission_dict(company_user.role)

        if not permissions.get("can_manage_company"):
            return Response({"error": "Permission denied"}, status=403)

        company = company_user.company

        total_tasks = Task.objects.filter(company=company).count()
        completed_tasks = Task.objects.filter(
            company=company, status="COMPLETED"
        ).count()
        pending_tasks = Task.objects.filter(
            company=company, status="PENDING"
        ).count()

        # Completion %
        completion_rate = (
            (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0
        )

        # Overdue Tasks
        overdue_tasks = Task.objects.filter(
            company=company,
            due_date__lt=timezone.now(),
            status__in=["PENDING", "IN_PROGRESS"]
        ).count()

        data = {
            "total_clients": Project.objects.filter(company=company)
                .values("client")
                .distinct()
                .count(),

            "total_employees": CompanyUser.objects.filter(
                company=company
            ).count(),

            "total_projects": Project.objects.filter(
                company=company
            ).count(),

            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "completion_rate": round(completion_rate, 2),
            "overdue_tasks": overdue_tasks,
        }

        serializer = OverviewSerializer(data)
        return Response(serializer.data)


class MyTasksAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        company_user = get_company_user(request.user)
        permissions = get_permission_dict(company_user.role)

        if not permissions.get("can_view_assigned_tasks"):
            return Response({"error": "Permission denied"}, status=403)

        tasks = Task.objects.filter(assigned_to=company_user)

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class MyProjectsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        company_user = get_company_user(request.user)
        permissions = get_permission_dict(company_user.role)

        if not permissions.get("can_view_project_progress"):
            return Response({"error": "Permission denied"}, status=403)

        projects = Project.objects.filter(team_members=company_user)

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class UserListAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        company_user = get_company_user(request.user)
        permissions = get_permission_dict(company_user.role)

        if not permissions.get("can_manage_users"):
            return Response({"error": "Permission denied"}, status=403)

        users = CompanyUser.objects.filter(company=company_user.company)

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class MyLeaveListAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        company_user = get_company_user(request.user)

        leaves = LeaveRequest.objects.filter(company_user=company_user)

        serializer = LeaveSerializer(leaves, many=True)
        return Response(serializer.data)

