from rest_framework import serializers
from .models import (
    EmployeeProfile,
    Department,
    Attendance,
    LeaveRequest,
    PerformanceReview,
)

class DepartmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Department
        fields = ["id", "name", "description"]

class EmployeeProfileSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source="department",
        write_only=True,
        required=False
    )

    class Meta:
        model = EmployeeProfile
        fields = [
            "id",
            "department",
            "department_id",
            "designation",
            "date_joined",
            "salary",
            "phone",
            "address",
        ]

class AttendanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendance
        fields = [
            "id",
            "date",
            "check_in",
            "check_out",
            "status",
        ]

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
        read_only_fields = ["status"]

class PerformanceReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = PerformanceReview
        fields = [
            "id",
            "rating",
            "feedback",
            "review_date",
        ]

