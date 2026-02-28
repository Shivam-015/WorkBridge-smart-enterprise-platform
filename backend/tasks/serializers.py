from rest_framework import serializers
from .models import Task
from companies.models import CompanyUser


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ['created_by', 'company' , 'progress']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request and request.user.is_authenticated:
            company_user = CompanyUser.objects.filter(
                user=request.user
            ).first()

            if company_user:
                company = company_user.company

                # Only Employees (40–69) assignable
                self.fields["assigned_to"].queryset = CompanyUser.objects.filter(
                    company=company,
                    role__level__gte=40,
                    role__level__lt=70
                )

                # Client ko progress aur internal fields hide
                if company_user.role.level == 10:
                    self.fields.pop("progress", None)
                    self.fields.pop("assigned_to", None)

    def validate(self, data):
        request = self.context.get("request")
        company_user = CompanyUser.objects.filter(
            user=request.user
        ).first()

        if not company_user:
            raise serializers.ValidationError("Company not found")

        # CREATE case
        if self.instance is None:
            if company_user.role.level < 60:
                raise serializers.ValidationError(
                    "You are not allowed to create tasks."
                )

        return data
        