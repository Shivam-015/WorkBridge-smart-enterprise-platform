from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from companies.utils import get_company_user, get_permission_dict
from companies.models import CompanyUser

from .models import *
from .serializers import *

class MyProfileAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user = get_company_user(request.user)

        profile = EmployeeProfile.objects.get(company_user=company_user)
        serializer = EmployeeProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        company_user = get_company_user(request.user)
        profile = EmployeeProfile.objects.get(company_user=company_user)

        serializer = EmployeeProfileSerializer(
            profile, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class DepartmentListCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user = get_company_user(request.user)
        departments = Department.objects.filter(company=company_user.company)
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)

    def post(self, request):
        company_user = get_company_user(request.user)
        permissions = get_permission_dict(company_user.role)

        if not permissions.get("can_manage_hr"):
            return Response({"error": "Permission denied"}, status=403)

        serializer = DepartmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(company=company_user.company)
        return Response(serializer.data, status=201)

class MyAttendanceAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user = get_company_user(request.user)
        attendance = Attendance.objects.filter(company_user=company_user)

        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)

class UpdateLeaveStatusAPI(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, leave_id):
        company_user = get_company_user(request.user)
        permissions = get_permission_dict(company_user.role)

        if not permissions.get("can_manage_hr"):
            return Response({"error": "Permission denied"}, status=403)

        leave = LeaveRequest.objects.get(id=leave_id)

        leave.status = request.data.get("status")
        leave.save()

        serializer = LeaveSerializer(leave)
        return Response(serializer.data)

class AddPerformanceReviewAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, employee_id):
        company_user = get_company_user(request.user)
        permissions = get_permission_dict(company_user.role)

        if not permissions.get("can_manage_hr"):
            return Response({"error": "Permission denied"}, status=403)

        employee = CompanyUser.objects.get(id=employee_id)

        serializer = PerformanceReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(
            company_user=employee,
            reviewer=company_user
        )

        return Response(serializer.data, status=201)