from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CompanyUser, Role, Company

User = get_user_model()


# =========================
# REGISTRATION
# =========================

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

        # Create Global User
        user = User.objects.create_user(
            username=validated_data['admin_email'],
            email=validated_data['admin_email'],
            password=validated_data['password'],
            first_name=validated_data['admin_name']
        )

        # Create OWNER Role
        owner_role = Role.objects.create(
            name="OWNER",
            company=company
        )

        # Link User to Company
        CompanyUser.objects.create(
            user=user,
            company=company,
            role=owner_role,
            name=user.first_name,
            email=user.email,
            status="ACTIVE"
        )

        return user


# =========================
# COMPANY SERIALIZER
# =========================

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


# =========================
# CREATE USER (FIXED VERSION)
# =========================

class CreateUserSerializer(serializers.Serializer):
    company_id = serializers.IntegerField()
    first_name = serializers.CharField()
    email = serializers.EmailField()
    role_id = serializers.IntegerField()

    def validate(self, data):

        #  Company check
        try:
            company = Company.objects.get(id=data["company_id"])
        except Company.DoesNotExist:
            raise serializers.ValidationError("Company not found.")

        #  Role check
        try:
            role = Role.objects.get(id=data["role_id"], company=company)
        except Role.DoesNotExist:
            raise serializers.ValidationError("Invalid role for this company.")

        # Duplicate check
        existing_user = User.objects.filter(email=data["email"]).first()

        if existing_user:
            if CompanyUser.objects.filter(
                user=existing_user,
                company=company
            ).exists():
                raise serializers.ValidationError(
                    "User already exists in this company."
                )

        return data

    def create(self, validated_data):

        company = Company.objects.get(id=validated_data["company_id"])

        user, created = User.objects.get_or_create(
            email=validated_data["email"],
            defaults={
                "username": validated_data["email"],
                "first_name": validated_data["first_name"],
                "is_active": False
            }
        )

        company_user = CompanyUser.objects.create(
            user=user,
            company=company,
            role_id=validated_data["role_id"],
            status="INVITED"
        )

        return company_user