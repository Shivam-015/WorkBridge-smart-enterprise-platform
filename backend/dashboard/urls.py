from django.urls import path
from .views import *

urlpatterns = [
    path("overview/", DashboardOverviewAPI.as_view()),
    path("my-tasks/", MyTasksAPI.as_view()),
    path("my-projects/", MyProjectsAPI.as_view()),
    path("users/", UserListAPI.as_view()),
    path("my-leaves/", MyLeaveListAPI.as_view()),
]