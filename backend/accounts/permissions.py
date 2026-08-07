from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    # this allow the access to users with the role admin

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsRegularUser(BasePermission):
    # allow access only to the user with the role ='user'
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "user"
        )