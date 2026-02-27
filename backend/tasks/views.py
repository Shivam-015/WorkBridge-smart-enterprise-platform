from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied
from companies.models import CompanyUser
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    # task assigned to whom
    def get_company_user(self):
        return CompanyUser.objects.filter(
            user=self.request.user
        ).first()

    # task details
    def get_queryset(self):
        company_user = self.get_company_user()

        if not company_user:
            return Task.objects.none()

        role = company_user.role

        if role.level >= 70:
            return Task.objects.filter(company=company_user.company)

        if role.level > 20:
            return Task.objects.filter(
                assigned_to=company_user,
                company=company_user.company
            )

        if role.level == 20:
            return Task.objects.filter(company=company_user.company)

        return Task.objects.none()

    # create task
    def perform_create(self, serializer):
        company_user = self.get_company_user()

        if not company_user:
            raise PermissionDenied("Company not found")

        if company_user.role.level < 70:
            raise PermissionDenied("You don't have permission to create tasks")

        serializer.save(
            created_by=company_user,
            company=company_user.company
        )

    # update task
    def perform_update(self, serializer):
        company_user = self.get_company_user()

        if not company_user:
            raise PermissionDenied("Company not found")

        task = self.get_object()

        # Manager / HR
        if company_user.role.level >= 60:
            serializer.save()
            return

        # Employee → only own task update
        if company_user.role.level >= 40 and task.assigned_to == company_user:
            serializer.save()
            return

        raise PermissionDenied("You don't have permission to update this task")


    # delete(soft delete)
    def perform_destroy(self, instance):
        company_user = self.get_company_user()

        if not company_user or company_user.role.level < 70:
            raise PermissionDenied("You don't have permission to delete tasks")

        instance.delete()

        