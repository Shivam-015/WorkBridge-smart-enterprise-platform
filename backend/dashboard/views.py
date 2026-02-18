from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import User
from tasks.models import Task

class AdminDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        if user.role != "ADMIN":
            return Response(
                {"error": "Only Admin can access dashboard"},
                status=403
            )

        company = user.company

        total_users = User.objects.filter(company=company).count()
        total_tasks = Task.objects.filter(company=company).count()
        completed_tasks = Task.objects.filter(
            company=company,
            status='COMPLETED'
        ).count()

        pending_tasks = Task.objects.filter(
            company=company,
            status='PENDING'
        ).count()

        data = {
            "total_users": total_users,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks
        }

        return Response(data)