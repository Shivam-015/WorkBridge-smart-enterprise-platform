from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Company

User = get_user_model()


# REGISTRATION PAGE


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
        company = Company.objects.create(
            name=validated_data['company_name'],
            email=validated_data['company_email'],
            phone=validated_data['company_phone'],
            industry=validated_data['industry_type'],
            size=validated_data['company_size']
        )

        user = User.objects.create_user(
            username=validated_data['admin_email'],
            email=validated_data['admin_email'],
            password=validated_data['password'],
            role="ADMIN",
            company=company,
            first_name=validated_data['admin_name']
        )

        return user



# LOGIN PAGE


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

        refresh = RefreshToken.for_user(user)

        return {
            "success": True,
            "message": "Login successful",
            "data": {
                "user_id": user.id,
                "name": f"{user.first_name} {user.last_name}".strip() or "User",
                "email": user.email,
                "role": user.role,
                "company": user.company.name if user.company else None,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        }



# CREATE USER 

class CreateUserSerializer(serializers.ModelSerializer):
    company = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'email', 'password', 'role', 'company']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # Email Unique 
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    def validate(self, data):
        request = self.context['request']
        creator = request.user

        creator_role = str(getattr(creator, "role", "")).upper()
        new_role = str(data.get("role", "")).upper()

        # ADMIN can create anyone
        if creator_role == "ADMIN":
            return data

        # HR,MANAGER can only create EMPLOYEE
        if creator_role in ["HR", "MANAGER"]:
            if new_role != "EMPLOYEE":
                raise serializers.ValidationError(
                    "HR and Manager can only create Employees."
                )
            return data

        # Others cannot create users
        raise serializers.ValidationError(
            "You are not allowed to create users."
        )

    # Create User 
    def create(self, validated_data):
        request = self.context['request']

        company_name = validated_data.pop('company', None)

        
        if company_name:
            company = Company.objects.filter(name=company_name).first()
            if not company:
                raise serializers.ValidationError(
                    f"Company '{company_name}' does not exist."
                )
        else:
            company = getattr(request.user, 'company', None)
            if not company:
                raise serializers.ValidationError(
                    "Logged-in user has no company assigned."
                )

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=str(validated_data.get('role', 'EMPLOYEE')).upper(),
            company=company,
            first_name=validated_data.get('first_name', '')
        )

        return user
