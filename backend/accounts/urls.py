from django.urls import path
from .views import *
urlpatterns = [
    
    path("login/", LoginView.as_view()),
    path("attendance/checkin/", MarkAttendanceAPI.as_view()),
    path("attendance/checkout/", CheckoutAttendanceAPI.as_view()),
    path("leave/apply/", ApplyLeaveAPI.as_view()),
    path("leave/my/", MyLeaveListAPI.as_view()),
    
]