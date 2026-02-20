from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer

class TaskView(APIView):

    permission_classes = [IsAuthenticated]

    # CREATE TASK
    def post(self, request):

        serializer = TaskSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "message": "Task created successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=400)

    # GET TASKS (Role Based)
    def get(self, request):

        user = request.user

        if user.role == "ADMIN":
            tasks = Task.objects.filter(company=user.company)

        elif user.role in ["HR", "MANAGER"]:
            tasks = Task.objects.filter(company=user.company)

        else:
            tasks = Task.objects.filter(assigned_to=user)

        serializer = TaskSerializer(tasks, many=True)

        return Response(serializer.data)