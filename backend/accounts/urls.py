from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
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
      path( "token/refresh/", TokenRefreshView.as_view(), name="token_refresh",
    ),
]
