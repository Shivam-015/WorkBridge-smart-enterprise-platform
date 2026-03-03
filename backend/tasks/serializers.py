from rest_framework import serializers
from .models import Task
from companies.models import CompanyUser


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = "__all__"

    #  Hide progress during creation
    def get_fields(self):
        fields = super().get_fields()

        request = self.context.get("request")

        if request and request.method == "POST":
            fields.pop("progress", None)

        return fields

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request and request.user.is_authenticated:
            company_user = CompanyUser.objects.filter(
                user=request.user
            ).select_related("company", "role").first()

            if company_user:
                company = company_user.company

                # Only Employees assignable (level 40–69)
                if "assigned_to" in self.fields:
                    self.fields["assigned_to"].queryset = CompanyUser.objects.filter(
                        company=company,
                        role__level__gte=40,
                        role__level__lt=70
                    )