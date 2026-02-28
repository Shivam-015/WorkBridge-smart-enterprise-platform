from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import PermissionDenied
from .models import Task
from .serializers import TaskSerializer
from companies.utils import get_company_user, get_permission_dict


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    # ================= GET TASKS =================
    def get_queryset(self):
        company_user = get_company_user(self.request.user)

        if not company_user:
            return Task.objects.none()

        role = company_user.role
        permissions = get_permission_dict(role)

        # 🔹 Admin / Manager: see all tasks
        if permissions.get("can_view_all_tasks"):
            return Task.objects.filter(company=company_user.company)

        # 🔹 Manager: see team tasks
        if permissions.get("can_view_team_tasks"):
            return Task.objects.filter(project__manager=company_user)

        # 🔹 Employee: see own tasks
        if permissions.get("can_view_assigned_tasks"):
            return Task.objects.filter(assigned_to=company_user)

        return Task.objects.none()

    # ================= CREATE TASK =================
    def perform_create(self, serializer):
        company_user = get_company_user(self.request.user)

        if not company_user:
            raise PermissionDenied("Company not found")

        permissions = get_permission_dict(company_user.role)
        if not permissions.get("can_assign_task"):
            raise PermissionDenied("You don't have permission to create tasks")

        serializer.save(
            created_by=company_user,
            company=company_user.company
        )

    # ================= UPDATE TASK =================
    def perform_update(self, serializer):
        company_user = get_company_user(self.request.user)

        if not company_user:
            raise PermissionDenied("Company not found")

        task = self.get_object()
        permissions = get_permission_dict(company_user.role)

        # 🔹 Manager / Admin can update any task
        if permissions.get("can_assign_task") or permissions.get("can_view_all_tasks"):
            serializer.save()
            return

        # 🔹 Employee can update only own task
        if permissions.get("can_update_task_status") and task.assigned_to == company_user:
            serializer.save()
            return

        raise PermissionDenied("You don't have permission to update this task")

    # ================= DELETE TASK =================
    def perform_destroy(self, instance):
        company_user = get_company_user(self.request.user)

        if not company_user:
            raise PermissionDenied("Company not found")

        permissions = get_permission_dict(company_user.role)
        if not permissions.get("can_assign_task"):
            raise PermissionDenied("You don't have permission to delete tasks")

        instance.delete()