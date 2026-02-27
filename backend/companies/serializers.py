from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CompanyUser, Role, Company
from django.db import transaction

User = get_user_model()

# =========================
# COMPANY SERIALIZER
# =========================

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


# =========================
# REGISTRATION
# =========================

class RegistrationSerializer(serializers.Serializer):
    company = CompanySerializer()

    owner_name = serializers.CharField(max_length=150)
    owner_email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_owner_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "User with this email already exists."
            )
        return value

    @transaction.atomic
    def create(self, validated_data):
        company_data = validated_data.pop("company")

        company = Company.objects.create(**company_data)

        #  Create Owner User 
        user = User.objects.create_user(
            username=validated_data["owner_email"],
            email=validated_data["owner_email"],
            password=validated_data["password"],
            first_name=validated_data["owner_name"]
        )

        # Assign Owner to Company (OneToOne)
        company.owner = user
        company.save()

        # Create OWNER Role (Full Access)
        owner_role = Role.objects.create(
            name="OWNER",
            company=company,
            level=100,
            can_manage_company=True,
            can_manage_roles=True,
            can_manage_users=True,
            can_create_project=True,
            can_assign_task=True,
            can_view_all_tasks=True,
            can_view_team_tasks=True,
            can_view_assigned_tasks=True,
            can_update_task_status=True,
            can_view_project_progress=True,
        )

        # 5️⃣ Link User to Company
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

# role model 
class RoleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Role
        fields = "__all__"
        read_only_fields = ("level", "company")