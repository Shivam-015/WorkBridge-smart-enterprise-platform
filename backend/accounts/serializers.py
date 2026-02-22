from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from companies.models import Company, CompanyUser, Role

User = get_user_model()



# REGISTRATION


class RegistrationSerializer(serializers.Serializer):
    company_name = serializers.CharField(max_length=255)
    company_email = serializers.EmailField()
    company_phone = serializers.CharField(max_length=15)
    industry_type = serializers.CharField(max_length=100)
    company_size = serializers.CharField(max_length=50)

    admin_name = serializers.CharField(max_length=150)
    admin_email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def create(self, validated_data):

        #  Create Company
        company = Company.objects.create(
            name=validated_data['company_name'],
            email=validated_data['company_email'],
            phone=validated_data['company_phone'],
            industry=validated_data['industry_type'],
            size=validated_data['company_size']
        )

        #  Create Global User
        user = User.objects.create_user(
            username=validated_data['admin_email'],
            email=validated_data['admin_email'],
            password=validated_data['password'],
            first_name=validated_data['admin_name']
        )

        # Create OWNER Role for this company
        owner_role = Role.objects.create(
            name="OWNER",
            company=company
        )

        #  Link User 
        CompanyUser.objects.create(
            user=user,
            company=company,
            role=owner_role
        )

        return user


# LOGIN

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        # Get company + role info
        company_user = CompanyUser.objects.filter(user=user).first()

        refresh = RefreshToken.for_user(user)

        return {
            "success": True,
            "message": "Login successful",
            "data": {
                "user_id": user.id,
                "name": f"{user.first_name} {user.last_name}".strip() or "User",
                "email": user.email,
                "role": company_user.role.name if company_user else None,
                "company": company_user.company.name if company_user else None,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        }