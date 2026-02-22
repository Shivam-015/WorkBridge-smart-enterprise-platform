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

    def get_company_user(self):
        return CompanyUser.objects.filter(
            user=self.request.user
        ).first()

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

    def perform_update(self, serializer):
        company_user = self.get_company_user()

        if not company_user:
            raise PermissionDenied("Company not found")

        role = company_user.role
        task = self.get_object()

        if role.level >= 70:
            serializer.save()
            return

        if role.level > 20 and task.assigned_to == company_user:
            serializer.save()
            return

        raise PermissionDenied("You don't have permission to update this task")

    def perform_destroy(self, instance):
        company_user = self.get_company_user()

        if not company_user or company_user.role.level < 70:
            raise PermissionDenied("You don't have permission to delete tasks")

        instance.delete()