from rest_framework import serializers
from companies.models import CompanyUser
from projects.models import Project
from tasks.models import Task
from hr.models import LeaveRequest


# 🔹 Overview
class OverviewSerializer(serializers.Serializer):
    total_clients = serializers.IntegerField()
    total_employees = serializers.IntegerField()
    total_projects = serializers.IntegerField()
    total_tasks = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    completion_rate = serializers.FloatField()
    overdue_tasks = serializers.IntegerField()


# 🔹 Users
class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="role.name", allow_null=True)

    class Meta:
        model = CompanyUser
        fields = ["id", "name", "email", "role", "status"]


# 🔹 Projects
class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "status",
            "progress",
            "priority",
            "start_date",
            "end_date",
        ]


# 🔹 Tasks
class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "status",
            "priority",
            "progress",
            "due_date",
        ]


# 🔹 Leaves
class LeaveSerializer(serializers.ModelSerializer):

    class Meta:
        model = LeaveRequest
        fields = [
            "id",
            "start_date",
            "end_date",
            "reason",
            "status",
            "applied_on",
        ]