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

    # get tasks
    def get_queryset(self):
        company_user = get_company_user(self.request.user)

        if not company_user:
            return Task.objects.none()

        permissions = get_permission_dict(company_user.role)

        if permissions.get("can_view_all_tasks"):
            return Task.objects.filter(company=company_user.company)

        if permissions.get("can_view_team_tasks"):
            return Task.objects.filter(project__manager=company_user)

        if permissions.get("can_view_assigned_tasks"):
            return Task.objects.filter(assigned_to=company_user)

        return Task.objects.none()

    # Create Tasks
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

    # update tasks
    def partial_update(self, request, *args, **kwargs):
        company_user = get_company_user(request.user)

        if not company_user:
            raise PermissionDenied("Company not found")

        task = self.get_object()
        permissions = get_permission_dict(company_user.role)

        # Only assigned employee can update
        if task.assigned_to != company_user:
            raise PermissionDenied("You can only update your assigned task")

        if not permissions.get("can_update_task_status"):
            raise PermissionDenied("You don't have permission to update task")

        allowed_fields = {
            "status",
            "progress",
            "attachment",
            "image",
            "reference_link",
        }

        for field in request.data.keys():
            if field not in allowed_fields:
                raise PermissionDenied(
                    f"You can only update: {', '.join(allowed_fields)}"
                )

        return super().partial_update(request, *args, **kwargs)

    #  DELETE TASK 
    def perform_destroy(self, instance):
        company_user = get_company_user(self.request.user)

        if not company_user:
            raise PermissionDenied("Company not found")

        permissions = get_permission_dict(company_user.role)

        if not permissions.get("can_assign_task"):
            raise PermissionDenied("You don't have permission to delete tasks")

        instance.delete()