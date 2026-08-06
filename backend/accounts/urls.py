from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    profileView,
    ChangePasswordView,
    AdminOnlyView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", profileView.as_view(), name="profile"),
    path("changepw/", ChangePasswordView.as_view(), name="change-password"),
    # path("admintest/", AdminOnlyView.as_view(), name="admin test"),
]
