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

from django.core.mail import send_mail
from django.conf import settings

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


# CREATE USER & SEND INVITE
class CreateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateUserSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            company_user = serializer.save()

            # 🔹 Determine recipient email
            recipient_email = company_user.user.email if company_user.user else company_user.email
            if not recipient_email:
                return Response({"error": "User has no email"}, status=400)

            # 🔹 Generate invite link
            invite_link = f"https://yourfrontend.com/set-password/{company_user.invite_token}"

            # 🔹 Send email
            send_mail(
                subject="You're invited to join Our Platform",
                message=f"Hello,\n\nYou have been invited to join the company.\nPlease set your password using this link:\n{invite_link}\n\nThank you!",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                fail_silently=False
            )

            return Response({
                "success": True,
                "message": "Invite sent successfully",
                "invite_token": str(company_user.invite_token)
            }, status=201)

        return Response(serializer.errors, status=400)



# SET PASSWORD VIEW
class SetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        #  Validate invite token
        try:
            company_user = CompanyUser.objects.get(invite_token=token)
        except CompanyUser.DoesNotExist:
            return Response({"error": "Invalid or expired link"}, status=400)

        #  Set user password and activate account
        user = company_user.user
        user.set_password(serializer.validated_data["password"])
        user.is_active = True
        user.save()

        # Update company user record
        company_user.status = "ACTIVE"
        company_user.invite_token = None  # prevent reuse
        company_user.save()

        return Response({"message": "Password set successfully"}, status=200)

#ROLE VIEW
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
#CURRENT view
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_user = get_company_user(request.user)

        if not company_user:
            return Response({"error": "Not linked to company"}, status=403)

        serializer = CurrentUserSerializer(company_user)
        return Response(serializer.data)