from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from companies.utils import get_company_user, get_permission_dict
from companies.models import CompanyUser
from projects.models import Project
from tasks.models import Task
from hr.models import LeaveRequest 
from .serializers import *

def has_permission(request, permission_name):
    company_user = get_company_user(request.user)
    permissions = get_permission_dict(company_user.role)

    if not permissions.get(permission_name):
        return None, Response({"error": "Permission denied"}, status=403)

    return company_user, None

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

class AllTasksAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_view_all_tasks")
        if error:
            return error

        tasks = Task.objects.filter(company=company_user.company)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class TaskAnalyticsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_view_task_analytics")
        if error:
            return error

        company = company_user.company

        total = Task.objects.filter(company=company).count()
        completed = Task.objects.filter(company=company, status="COMPLETED").count()
        overdue = Task.objects.filter(
            company=company,
            due_date__lt=timezone.now(),
            status__in=["PENDING", "IN_PROGRESS"]
        ).count()

        return Response({
            "total_tasks": total,
            "completed_tasks": completed,
            "overdue_tasks": overdue,
        })

class TeamLeaveListAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_approve_leaves")
        if error:
            return error

        leaves = LeaveRequest.objects.filter(
            company_user__company=company_user.company
        )
        serializer = LeaveSerializer(leaves, many=True)
        return Response(serializer.data)

class AllProjectsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_view_all_projects")
        if error:
            return error

        projects = Project.objects.filter(company=company_user.company)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

class ClientProjectsProgressAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_view_client_projects")
        if error:
            return error

        # Sirf client ke projects
        projects = Project.objects.filter(client=company_user)
        serializer = ClientProjectProgressSerializer(projects, many=True)
        return Response(serializer.data)

class ManagerProjectsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_view_team_tasks")
        if error:
            return error

        projects = Project.objects.filter(
            manager=company_user
        )

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

class ManagerOverviewAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_view_team_tasks")
        if error:
            return error

        projects = Project.objects.filter(manager=company_user)

        total_projects = projects.count()

        tasks = Task.objects.filter(project__in=projects)

        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status="COMPLETED").count()
        pending_tasks = tasks.filter(status="PENDING").count()
        in_progress_tasks = tasks.filter(status="IN_PROGRESS").count()

        overdue_tasks = tasks.filter(
            due_date__lt=timezone.now().date(),
            status__in=["PENDING", "IN_PROGRESS"]
        ).count()

        # Team members count
        team_members = CompanyUser.objects.filter(
            assigned_tasks__project__in=projects
        ).distinct().count()

        return Response({
            "total_projects": total_projects,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "in_progress_tasks": in_progress_tasks,
            "overdue_tasks": overdue_tasks,
            "team_members_count": team_members,
        })

class ManagerTeamTasksAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_view_team_tasks")
        if error:
            return error

        tasks = Task.objects.filter(
            project__manager=company_user
        ).select_related("assigned_to", "project")

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class ManagerTeamMembersAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_view_team_tasks")
        if error:
            return error

        members = CompanyUser.objects.filter(
            assigned_tasks__project__manager=company_user
        ).distinct()

        serializer = UserSerializer(members, many=True)
        return Response(serializer.data)

class ManagerProjectTasksAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        company_user, error = has_permission(request, "can_view_team_tasks")
        if error:
            return error

        project = Project.objects.filter(
            id=project_id,
            manager=company_user
        ).first()

        if not project:
            return Response({"error": "Project not found"}, status=404)

        tasks = project.tasks.all()

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

