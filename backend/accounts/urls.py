from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    profileView,
    ChangePasswordView,
    AdminOnlyView,
    AdminDashboardView,
    AdminUserListView,
    AdminUserDetailView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", profileView.as_view(), name="profile"),
    path("changepw/", ChangePasswordView.as_view(), name="change-password"),
    path("admintest/", AdminOnlyView.as_view(), name="admin test"),
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("admin/users/<int:user_id>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
]
