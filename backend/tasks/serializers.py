from rest_framework import serializers

from companies.models import CompanyUser
from projects.models import ProjectTeam

from .models import Task


def get_company_user_name(company_user):
    if not company_user:
        return None
    if company_user.name:
        return company_user.name

    user = getattr(company_user, "user", None)
    if user:
        full_name = f"{user.first_name} {user.last_name}".strip()
        if full_name:
            return full_name
        if user.email:
            return user.email
        if user.username:
            return user.username

    return company_user.email


class TaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "assigned_to",
            "assigned_to_name",
            "created_by",
            "created_by_name",
            "company",
            "status",
            "priority",
            "due_date",
            "attachment",
            "image",
            "reference_link",
            "progress",
            "created_at",
            "project",
        ]
        read_only_fields = ["created_by", "company", "assigned_to_name", "created_by_name"]

    def get_assigned_to_name(self, obj):
        return get_company_user_name(getattr(obj, "assigned_to", None))

    def get_created_by_name(self, obj):
        return get_company_user_name(getattr(obj, "created_by", None))

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

                if "assigned_to" in self.fields:
                    queryset = CompanyUser.objects.filter(
                        company=company,
                        role__level__gte=40,
                        role__level__lt=70
                    )

                    project_id = request.data.get("project")

                    if project_id:
                        team_members = ProjectTeam.objects.filter(
                            project_id=project_id
                        ).values_list("member_id", flat=True)

                        queryset = queryset.filter(id__in=team_members)

                    self.fields["assigned_to"].queryset = queryset
