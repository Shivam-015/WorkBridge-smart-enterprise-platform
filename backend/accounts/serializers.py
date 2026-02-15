from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Company

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

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
        # Create Company
        company = Company.objects.create(
            name=validated_data['company_name'],
            email=validated_data['company_email'],
            phone=validated_data['company_phone'],
            industry=validated_data['industry_type'],
            size=validated_data['company_size']
        )

        # Create Admin User
        user = User.objects.create_user(
            username=validated_data['admin_email'],
            email=validated_data['admin_email'],
            password=validated_data['password'],
            role='ADMIN',
            company=company,
            first_name=validated_data['admin_name']
        )

        return user

#login serializers

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError({
                "success": False,
                "message": "Email and password are required"
            })

        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError({
                "success": False,
                "message": "Invalid email or password"
            })

        if not user.is_active:
            raise serializers.ValidationError({
                "success": False,
                "message": "User account is disabled"
            })

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return {
    "success": True,
    "message": "Login successful",
    "data": {
        "user_id": user.id,
        "name": f"{getattr(user, 'first_name', '')} {getattr(user, 'last_name', '')}".strip() or "Admin User",
        "email": user.email,
        "role": getattr(user, 'role', 'ADMIN'),
        "company": user.company.name if user.company else "Tech Pvt Ltd",
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }
}


class CreateUserSerializer(serializers.ModelSerializer):
    # Optional company field for explicit creation
    company = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'email', 'password', 'role', 'company']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "User with this email already exists."
            )
        return value

    def validate(self, data):
        request = self.context['request']
        creator = request.user
        new_role = data.get("role")

        # Permission check
        if creator.role == "ADMIN":
            return data

        if creator.role in ["HR", "MANAGER"]:
            if new_role != "EMPLOYEE":
                raise serializers.ValidationError(
                    "You can only create Employees"
                )
        else:
            raise serializers.ValidationError(
                "You are not allowed to create users"
            )

        return data

    def create(self, validated_data):
        request = self.context['request']

        # Explicit company if provided
        company_name = validated_data.pop('company', None)

        if company_name:
            companies = Company.objects.filter(name=company_name)
            if not companies.exists():
                raise serializers.ValidationError(f"Company '{company_name}' does not exist.")
            company = companies.first()  # pick the first matching company
        else:
            # fallback to logged-in user's company
            company = getattr(request.user, 'company', None)
            if not company:
                raise serializers.ValidationError("Logged-in user has no company assigned.")

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'EMPLOYEE'),
            company=company,
            first_name=validated_data.get('first_name', '')
        )

        return user
