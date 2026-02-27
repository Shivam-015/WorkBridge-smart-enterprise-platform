from rest_framework import viewsets,status
from .models import Company,CompanyUser,Role
from .serializers import CompanySerializer,RegistrationSerializer,RoleSerializer,CreateUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import PermissionDenied


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


#for company users
        
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



from rest_framework.permissions import AllowAny

class SetPasswordView(APIView):
    
    permission_classes = [AllowAny]

    def post(self, request, token):

        password = request.data.get("password")

        if not password:
            return Response({"error": "Password required"}, status=400)

        try:
            company_user = CompanyUser.objects.get(invite_token=token)
        except CompanyUser.DoesNotExist:
            return Response({"error": "Invalid or expired link"}, status=400)

        user = company_user.user
        user.set_password(password)
        user.is_active = True
        user.save()

        company_user.status = "ACTIVE"
        company_user.save()

        return Response({"message": "Password set successfully"}, status=200)



class RoleViewSet(ModelViewSet):

    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Role.objects.filter(
            company=self.request.user.companyuser.company
        )

    def perform_create(self, serializer):

        company_user = self.request.user.companyuser

        # Only if can manage roles
        if not company_user.role.can_manage_roles:
            raise PermissionDenied("You cannot create roles")

        new_role = serializer.save(company=company_user.company)

        # LEVEL HIERARCHY CHECK
        if new_role.level >= company_user.role.level:
            raise PermissionDenied(
                "Cannot create role equal or higher than your authority"
            )