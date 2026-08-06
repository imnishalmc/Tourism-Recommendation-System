from rest_framework.permissions import BasePermission, SAFE_METHODS


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


class IsOwnerOrReadOnly(BasePermission):
    """Allows anyone to read (GET/HEAD/OPTIONS), but only the object's
    original creator (obj.user) can modify or delete it."""

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user
