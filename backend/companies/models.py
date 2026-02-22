from django.db import models
from django.conf import settings


class Company(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    industry = models.CharField(max_length=100)
    size = models.CharField(max_length=50)
    address = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)

    def __str__(self):
        return self.name


class Role(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    name = models.CharField(max_length=50)
    slug = models.SlugField(blank=True)

    #  Company Control
    can_manage_company = models.BooleanField(default=False)
    can_manage_roles = models.BooleanField(default=False)
    can_manage_users = models.BooleanField(default=False)

    #  Project Control
    can_create_project = models.BooleanField(default=False)
    can_assign_task = models.BooleanField(default=False)
    can_view_all_tasks = models.BooleanField(default=False)
    can_view_team_tasks = models.BooleanField(default=False)

    # Employee Actions
    can_view_assigned_tasks = models.BooleanField(default=False)
    can_update_task_status = models.BooleanField(default=False)

    #  Client Access
    can_view_project_progress = models.BooleanField(default=False)

    # Level Based Hierarchy
    level = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.name} ({self.company.name})"


import uuid

import uuid
from django.conf import settings
from django.db import models


class CompanyUser(models.Model):

    STATUS_CHOICES = (
        ("INVITED", "Invited"),
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    )

    user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    null=True,
    blank=True
)

    name = models.CharField(max_length=100, null=True, blank=True)

    email = models.EmailField(null=True, blank=True)

    company = models.ForeignKey("Company", on_delete=models.CASCADE)
    role = models.ForeignKey("Role", on_delete=models.CASCADE)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="INVITED"
    )

    invite_token = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.email if self.email else self.name