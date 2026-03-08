from rest_framework import serializers
from .models import Project , ProjectTeam


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ["created_at",'progress','company']

    def create(self, validated_data):

        team_data = validated_data.pop("team_members", [])
        project = Project.objects.create(**validated_data)

        for member in team_data:
            ProjectTeam.objects.create(
                project=project,
                member_id=member["member_id"],
                role=member["role"]
            )

        return project

    def validate_progress(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Progress must be between 0 and 100")
        return value

    def validate(self, data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError(
                {"end_date": "End date cannot be before start date"}
            )

        return data


class ProjectTeamSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectTeam
        fields = "__all__"