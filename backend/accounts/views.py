from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegistrationSerializer
from .serializers import LoginSerializer,CreateUserSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated


#REGISTRATION view
class RegistrationView(APIView):

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Company and Admin registered successfully."
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


# login view

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
           
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

      
        
#create user view

class CreateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CreateUserSerializer(
            data=request.data,
            context={"request": request}
        )
    
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "User created successfully",
                    "data": {
                        "id": user.id,
                        "name": user.first_name,
                        "email": user.email,
                        "role": user.role,
                        "company": user.company.name if user.company else "Tech Pvt Ltd",
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=400)
