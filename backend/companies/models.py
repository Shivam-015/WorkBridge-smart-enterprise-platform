from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Company(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    size = models.CharField(max_length=50)
    address = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="owned_company"
    )

    last_user_number = models.IntegerField(default=0)

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
    level = models.IntegerField(default=0)

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.name)

        # Auto level calculation
        permission_fields = [
            "can_manage_company",
            "can_manage_roles",
            "can_manage_users",
            "can_create_project",
            "can_assign_task",
            "can_view_all_tasks",
            "can_view_team_tasks",
            "can_view_assigned_tasks",
            "can_update_task_status",
            "can_view_project_progress",
        ]

        total = 0
        for field in permission_fields:
            if getattr(self, field):
                total += 10

        self.level = total  # auto-set level

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.company.name})"


import uuid

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
    account_no = models.IntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.account_no:
            # increment company counter
            self.account_no = self.company.last_user_number + 1
            self.company.last_user_number = self.account_no
            self.company.save()
        super().save(*args, **kwargs)

    def __str__(self):
        if self.email:
            return self.email
        if self.name:
         return self.name
        if self.user:
            return self.user.email
        return "CompanyUser"

