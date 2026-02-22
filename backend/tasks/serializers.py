from rest_framework import serializers
from .models import Task
from companies.models import CompanyUser


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        exclude = ['progress']
        read_only_fields = ['created_by', 'company']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request and request.user.is_authenticated:
            company_user = CompanyUser.objects.filter(
                user=request.user
            ).first()

            if company_user:
                company = company_user.company

                #  Only employees (level >20 and <70) in assigned_to
                self.fields["assigned_to"].queryset = CompanyUser.objects.filter(
                    company=company,
                    role__level__gt=20,
                    role__level__lt=70
                )

    def validate(self, data):
        request = self.context.get("request")
        company_user = CompanyUser.objects.filter(
            user=request.user
        ).first()

        if not company_user:
            raise serializers.ValidationError("Company not found")

        # Only level >=70 can create
        if company_user.role.level < 70:
            raise serializers.ValidationError("You are not allowed to create tasks.")

        return data