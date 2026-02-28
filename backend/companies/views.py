from rest_framework import viewsets,status
from .models import Company,CompanyUser,Role
from .serializers import *
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import PermissionDenied
from companies.utils import get_company_user

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

#for company
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

#create user view
class CreateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CreateUserSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            company_user = serializer.save()

            invite_link = f"https://yourfrontend.com/set-password/{company_user.invite_token}"

            send_mail(
                "You are invited to join company",
                f"Click below link to set your password:\n{invite_link}",
                "noreply@yourapp.com",
                [company_user.user.email],
            )

            return Response(
                {
                    "success": True,
                    "message": "Invite sent successfully",
                    "invite_token": str(company_user.invite_token)
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=400)

# password set
class SetPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request, token):

        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            company_user = CompanyUser.objects.get(invite_token=token)
        except CompanyUser.DoesNotExist:
            return Response({"error": "Invalid or expired link"}, status=400)

        user = company_user.user
        user.set_password(serializer.validated_data["password"])
        user.is_active = True
        user.save()

        company_user.status = "ACTIVE"
        company_user.invite_token = None  # 🔥 Important (prevent reuse)
        company_user.save()

        return Response({"message": "Password set successfully"}, status=200)


class RoleViewSet(ModelViewSet):

    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        company_user = get_company_user(self.request.user)
        if not company_user:
            return Role.objects.none()  # agar user linked nahi hai
        return Role.objects.filter(company=company_user.company)

    # create a new role 
    def perform_create(self, serializer):
        try:
            company_user = CompanyUser.objects.get(user=self.request.user)
        except CompanyUser.DoesNotExist:
            raise PermissionDenied("User not linked to any company")

        serializer.save(company=company_user.company)

        # Only if can manage roles
        if not company_user.role.can_manage_roles:
            raise PermissionDenied("You cannot create roles")

        new_role = serializer.save(company=company_user.company)

        # LEVEL HIERARCHY CHECK
        if new_role.level >= company_user.role.level:
            raise PermissionDenied(
                "Cannot create role equal or higher than your authority"
            )

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user = request.user.companyuser
        serializer = CurrentUserSerializer(company_user)
        return Response(serializer.data)