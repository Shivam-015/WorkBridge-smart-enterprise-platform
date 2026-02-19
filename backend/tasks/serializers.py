from rest_framework import serializers
from .models import Task
from django.contrib.auth import get_user_model

User = get_user_model()

class TaskSerializer(serializers.ModelSerializer):

    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all()
    )

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['created_by', 'company']

    def validate(self, data):
        request = self.context['request']
        user = request.user

        # Only ADMIN, HR, MANAGER can create task
        if user.role not in ['ADMIN', 'HR', 'MANAGER']:
            raise serializers.ValidationError(
                "You are not allowed to create tasks."
            )

        return data

    def create(self, validated_data):
        request = self.context['request']

        validated_data['created_by'] = request.user
        validated_data['company'] = request.user.company

        return super().create(validated_data)