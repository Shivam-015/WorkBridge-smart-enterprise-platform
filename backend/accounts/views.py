from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer
from rest_framework.exceptions import ValidationError
from companies.models import CompanyUser
from hr.models import Attendance, LeaveRequest
from django.utils import timezone 

# login view

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
           
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)



class MarkAttendanceAPI(APIView):

    def post(self, request):

        try:
            company_user = CompanyUser.objects.select_related("role").get(user=request.user)
        except CompanyUser.DoesNotExist:
            return Response({"error": "Not linked to company"}, status=403)

        today = timezone.now().date()

        attendance, created = Attendance.objects.get_or_create(
            company_user=company_user,
            date=today,
            defaults={
                "check_in": timezone.now().time(),
                "status": "PRESENT"
            }
        )

        if not created:
            return Response({"message": "Already marked today"}, status=400)

        return Response({
            "message": "Attendance marked successfully",
            "date": attendance.date,
            "check_in": attendance.check_in
        }, status=201)

class CheckoutAttendanceAPI(APIView):

    def post(self, request):

        try:
            company_user = CompanyUser.objects.get(user=request.user)
        except CompanyUser.DoesNotExist:
            return Response({"error": "Not linked to company"}, status=403)

        today = timezone.now().date()

        try:
            attendance = Attendance.objects.get(
                company_user=company_user,
                date=today
            )
        except Attendance.DoesNotExist:
            return Response({"error": "Check-in not done"}, status=400)

        if attendance.check_out:
            return Response({"message": "Already checked out"}, status=400)

        attendance.check_out = timezone.now().time()
        attendance.save()

        return Response({
            "message": "Checked out successfully",
            "check_out": attendance.check_out
        })

class ApplyLeaveAPI(APIView):

    def post(self, request):

        try:
            company_user = CompanyUser.objects.get(user=request.user)
        except CompanyUser.DoesNotExist:
            return Response({"error": "Not linked to company"}, status=403)

        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        reason = request.data.get("reason")

        if not start_date or not end_date or not reason:
            return Response({"error": "All fields required"}, status=400)

        leave = LeaveRequest.objects.create(
            company_user=company_user,
            start_date=start_date,
            end_date=end_date,
            reason=reason
        )

        return Response({
            "message": "Leave request submitted",
            "leave_id": leave.id,
            "status": leave.status
        }, status=201)


class MyLeaveListAPI(APIView):

    def get(self, request):

        try:
            company_user = CompanyUser.objects.get(user=request.user)
        except CompanyUser.DoesNotExist:
            return Response({"error": "Not linked to company"}, status=403)

        leaves = LeaveRequest.objects.filter(company_user=company_user)

        return Response([
            {
                "id": l.id,
                "start_date": l.start_date,
                "end_date": l.end_date,
                "reason": l.reason,
                "status": l.status,
                "applied_on": l.applied_on
            }
            for l in leaves
        ])

