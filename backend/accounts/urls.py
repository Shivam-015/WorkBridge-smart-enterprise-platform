from django.urls import path
from .views import RegistrationView, LoginView, CreateUserView

urlpatterns = [
    path("register/", RegistrationView.as_view()),
    path("login/", LoginView.as_view()),
    path("create-user/", CreateUserView.as_view()),
]