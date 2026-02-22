from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CompanyUser, Role,Company

User = get_user_model()

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class CreateUserSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    email = serializers.EmailField()
    role_id = serializers.IntegerField()

    def validate(self, data):
        request = self.context["request"]
        company = request.user.active_company

        # Role check
        try:
            Role.objects.get(id=data["role_id"], company=company)
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
        request = self.context["request"]
        company = request.user.active_company

        # Create or get global user
        user, created = User.objects.get_or_create(
            email=validated_data["email"],
            defaults={
                "username": validated_data["email"],
                "first_name": validated_data["first_name"],
                "is_active": False  # activate after password set
            }
        )

        company_user = CompanyUser.objects.create(
            user=user,
            company=company,
            role_id=validated_data["role_id"],
            status="INVITED"
        )

        return company_user