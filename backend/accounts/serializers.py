from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Company

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