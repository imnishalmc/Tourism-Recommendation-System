from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
    AdminUserSerializer,
)
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminRole, IsRegularUser
from .models import User
from destinations.models import Destination, Review
from django.db.models import Count


class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(
            raise_exception=True
        )  # raise exception helps the DRF to handle the error -reporting boiler plate
        user = serializer.save()  # if validation pass , it trigger the .create() method in the serializer to create a new user instance
        return Response(
            {
                "message": "Account created successfully.",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request,
            username=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
        if user is None:
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data,
            }
        )


class profileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"error": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"message": "Password changed successfully."})


class AdminOnlyView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        return Response({"message": "only the user can access this "})


class AdminDashboardView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        return Response({
            "users": User.objects.count(),
            "active_users": User.objects.filter(is_active=True).count(),
            "destinations": Destination.objects.count(),
            "reviews": Review.objects.count(),
            "recent_reviews": Review.objects.select_related("user", "destination").order_by("-created_at")[:5].values("id", "rating", "comment", "created_at", "user__full_name", "user__email", "destination__name"),
            "top_destinations": Destination.objects.annotate(review_total=Count("reviews")).order_by("-review_total", "name")[:5].values("id", "name", "district", "review_total"),
        })


class AdminUserListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        users = User.objects.order_by("-date_joined")
        search = request.query_params.get("search", "").strip()
        role = request.query_params.get("role")
        is_active = request.query_params.get("is_active")
        if search:
            users = users.filter(email__icontains=search) | users.filter(full_name__icontains=search)
        if role in ["admin", "user"]:
            users = users.filter(role=role)
        if is_active in ["true", "false"]:
            users = users.filter(is_active=is_active == "true")
        return Response(AdminUserSerializer(users, many=True).data)


class AdminUserDetailView(APIView):
    permission_classes = [IsAdminRole]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        if user == request.user and request.data.get("is_active") is False:
            return Response({"detail": "You cannot deactivate your own account."}, status=status.HTTP_400_BAD_REQUEST)
        if user == request.user and request.data.get("role") == "user":
            return Response({"detail": "You cannot remove your own admin role."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = AdminUserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_user = serializer.save()
        if "role" in serializer.validated_data:
            updated_user.is_staff = updated_user.role == "admin" or updated_user.is_superuser
            updated_user.save(update_fields=["is_staff"])
        return Response(AdminUserSerializer(updated_user).data)

    def delete(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        if user == request.user:
            return Response({"detail": "You cannot delete your own account."}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
