from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet,CreateUserView,SetPasswordView

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("create-user/", CreateUserView.as_view()),  
    path("set-password/<uuid:token>/", SetPasswordView.as_view())  
]