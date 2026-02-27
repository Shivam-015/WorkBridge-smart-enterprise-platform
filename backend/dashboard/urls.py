from django.urls import path
from .views import AdminDashboardView , ClientDashboardView

urlpatterns = [
    path("admin-dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("dashboard/", ClientDashboardView.as_view()),
]