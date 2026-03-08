from django.db.models import Q
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from companies.models import CompanyUser
from companies.utils import get_company_user, get_permission_dict
from hr.models import LeaveRequest
from projects.models import Project,ProjectTeam
from tasks.models import Task

from .serializers import (
    ClientProjectProgressSerializer,
    LeaveSerializer,
    OverviewSerializer,
    ProjectSerializer,
    TaskSerializer,
    UserSerializer,
)


def has_permission(request, permission_name):
    company_user = get_company_user(request.user)
    permissions = get_permission_dict(company_user.role)

    if not permissions.get(permission_name):
        return None, Response({"error": "Permission denied"}, status=403)

    return company_user, None


def is_manager_company_user(company_user):
    role_name = str(getattr(company_user.role, "name", "")).lower()
    role_slug = str(getattr(company_user.role, "slug", "")).lower()
    return "manager" in f"{role_name} {role_slug}".strip()


def can_view_team_scope(company_user):
    permissions = get_permission_dict(company_user.role)
    return permissions.get("can_view_team_tasks") or is_manager_company_user(company_user)


class DashboardOverviewAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user = get_company_user(request.user)
        permissions = get_permission_dict(company_user.role)

        if not permissions.get("can_manage_company"):
            return Response({"error": "Permission denied"}, status=403)

        company = company_user.company

        total_tasks = Task.objects.filter(company=company).count()
        completed_tasks = Task.objects.filter(company=company, status="COMPLETED").count()
        pending_tasks = Task.objects.filter(company=company, status="PENDING").count()

        completion_rate = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0

        overdue_tasks = Task.objects.filter(
            company=company,
            due_date__lt=timezone.now(),
            status__in=["PENDING", "IN_PROGRESS"],
        ).count()

        data = {
            "total_clients": Project.objects.filter(company=company)
            .values("client")
            .distinct()
            .count(),
            "total_employees": CompanyUser.objects.filter(company=company).count(),
            "total_projects": Project.objects.filter(company=company).count(),
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
        if not company_user:
            return Response({"error": "Company user not found"}, status=404)

        permissions = get_permission_dict(company_user.role)
        manager_role = is_manager_company_user(company_user)

        if not (
            permissions.get("can_view_assigned_tasks")
            or permissions.get("can_view_team_tasks")
            or manager_role
        ):
            return Response({"error": "Permission denied"}, status=403)

        if permissions.get("can_view_team_tasks") or manager_role:
            tasks = Task.objects.filter(company=company_user.company).filter(
                Q(assigned_to=company_user) | Q(created_by=company_user)
            ).distinct()
        else:
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

        projects = Project.objects.filter(
            team_members__member=company_user
        ).distinct()
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

        company_user = get_company_user(request.user)

        if not company_user:
            return Response({"error": "Company user not found"}, status=404)

        permissions = get_permission_dict(company_user.role)

        project_id = request.query_params.get("project_id")

        # OWNER / ADMIN
        if permissions.get("can_view_all_tasks"):
            tasks = Task.objects.filter(company=company_user.company)

        # MANAGER
        elif permissions.get("can_view_team_tasks"):
            tasks = Task.objects.filter(
                project__manager=company_user
            )

        # EMPLOYEE
        elif permissions("can_view_assigned_tasks"):
            tasks = Task.objects.filter(
                assigned_to=company_user
            )

        # Optional project filter
        if project_id:
            tasks = tasks.filter(project_id=project_id)

        tasks = tasks.select_related("assigned_to", "project")

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
            status__in=["PENDING", "IN_PROGRESS"],
        ).count()

        return Response(
            {
                "total_tasks": total,
                "completed_tasks": completed,
                "overdue_tasks": overdue,
            }
        )


class TeamLeaveListAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_approve_leave")
        if error:
            return error

        leaves = LeaveRequest.objects.select_related("company_user__role", "company_user__user").filter(
            company_user__company=company_user.company
        ).filter(
            Q(company_user__role__name__icontains="manager")
            | Q(company_user__role__slug__icontains="manager")
            | Q(company_user__role__name__icontains="employee")
            | Q(company_user__role__slug__icontains="employee")
        ).order_by("-applied_on")
        serializer = LeaveSerializer(leaves, many=True)
        return Response(serializer.data)


class AllProjectsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user, error = has_permission(request, "can_create_project")
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

        projects = Project.objects.filter(client=company_user)
        serializer = ClientProjectProgressSerializer(projects, many=True)
        return Response(serializer.data)


class ManagerProjectsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user = get_company_user(request.user)
        if not company_user:
            return Response({"error": "Company user not found"}, status=404)

        if not can_view_team_scope(company_user):
            return Response({"error": "Permission denied"}, status=403)

        projects = Project.objects.filter(manager=company_user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class ManagerOverviewAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user = get_company_user(request.user)
        if not company_user:
            return Response({"error": "Company user not found"}, status=404)

        permissions = get_permission_dict(company_user.role)
        manager_role = is_manager_company_user(company_user)

        if not (
            permissions.get("can_view_all_tasks")
            or permissions.get("can_view_team_tasks")
            or permissions.get("can_view_assigned_tasks")
            or manager_role
        ):
            return Response({"error": "Permission denied"}, status=403)

        projects = Project.objects.filter(manager=company_user)
        total_projects = projects.count()

        if permissions.get("can_view_all_tasks"):
            tasks = Task.objects.filter(company=company_user.company)
        elif permissions.get("can_view_team_tasks") or manager_role:
            tasks = Task.objects.filter(company=company_user.company).filter(
                Q(project__manager=company_user)
                | Q(project__isnull=True, created_by=company_user)
            ).distinct()
        else:
            tasks = Task.objects.filter(assigned_to=company_user)

        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status="COMPLETED").count()
        pending_tasks = tasks.filter(status="PENDING").count()
        in_progress_tasks = tasks.filter(status="IN_PROGRESS").count()

        overdue_tasks = tasks.filter(
            due_date__lt=timezone.now().date(),
            status__in=["PENDING", "IN_PROGRESS"],
        ).count()

        team_members = ProjectTeam.objects.filter(
            project__manager=company_user
        ).exclude(
            member=company_user
        ).values("member").distinct().count()

        return Response(
            {
                "total_projects": total_projects,
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "in_progress_tasks": in_progress_tasks,
                "overdue_tasks": overdue_tasks,
                "team_members_count": team_members,
            }
        )



class ManagerTeamMembersAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user = get_company_user(request.user)
        if not company_user:
            return Response({"error": "Company user not found"}, status=404)

        if not can_view_team_scope(company_user):
            return Response({"error": "Permission denied"}, status=403)

        members = CompanyUser.objects.filter(
            project_teams__project__manager=company_user
        ).distinct()

        serializer = UserSerializer(members, many=True)
        return Response(serializer.data)



class ProjectTeamListAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):

        team = ProjectTeam.objects.filter(project_id=project_id)

        data = [
            {
                "member_id": t.member.id,
                "name": t.member.name,
                "email": t.member.email,
                "role": t.role
            }
            for t in team
        ]

        return Response(data)

class AddProjectTeamMemberAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):

        company_user = get_company_user(request.user)

        project = Project.objects.filter(
            id=project_id,
            manager=company_user
        ).first()

        if not project:
            return Response({"error": "Project not found"}, status=404)

        member_id = request.data.get("member_id")
        role = request.data.get("role")

        if not member_id or not role:
            return Response({"error": "member_id and role required"}, status=400)

        member = CompanyUser.objects.filter(
            id=member_id,
            company=company_user.company
        ).first()

        if not member:
            return Response({"error": "Invalid member"}, status=404)

        # prevent duplicate
        if ProjectTeam.objects.filter(project=project, member=member).exists():
            return Response({"error": "Member already in team"}, status=400)

        ProjectTeam.objects.create(
            project=project,
            member=member,
            role=role
        )

        return Response({"message": "Team member added"})

class RemoveProjectTeamMemberAPI(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, project_id, member_id):

        company_user = get_company_user(request.user)

        project = Project.objects.filter(
            id=project_id,
            manager=company_user
        ).first()

        if not project:
            return Response({"error": "Project not found"}, status=404)

        team_member = ProjectTeam.objects.filter(
            project=project,
            member_id=member_id
        ).first()

        if not team_member:
            return Response({"error": "Member not found"}, status=404)

        team_member.delete()

        return Response({"message": "Member removed from project"})