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
from django.db.models import Avg, Count, Q
from django.utils import timezone
from datetime import timedelta


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
        # Get user statistics
        regular_users = User.objects.filter(role="user")
        total_users = regular_users.count()
        active_users = regular_users.filter(is_active=True).count()
        now = timezone.now()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)

        def monthly_counts(queryset, date_field):
            """Return six completed/current calendar-month counts for dashboard sparklines."""
            counts = []
            for offset in range(5, -1, -1):
                month_start = (current_month_start - timedelta(days=offset * 31)).replace(day=1)
                month_end = (month_start + timedelta(days=32)).replace(day=1)
                counts.append(queryset.filter(**{f"{date_field}__gte": month_start, f"{date_field}__lt": month_end}).count())
            return counts

        def monthly_totals(queryset, date_field):
            """Return running all-time totals at each of the last six month ends."""
            totals = []
            for offset in range(5, -1, -1):
                month_start = (current_month_start - timedelta(days=offset * 31)).replace(day=1)
                month_end = (month_start + timedelta(days=32)).replace(day=1)
                totals.append(queryset.filter(**{f"{date_field}__lt": month_end}).count())
            return totals

        def month_change(queryset, date_field):
            current = queryset.filter(**{f"{date_field}__gte": current_month_start}).count()
            previous = queryset.filter(**{
                f"{date_field}__gte": previous_month_start,
                f"{date_field}__lt": current_month_start,
            }).count()
            percent = round(((current - previous) / previous) * 100, 1) if previous else None
            return {"this_month": current, "percent_change": percent}

        review_activity = month_change(Review.objects.all(), "created_at")
        
        # Get user registration data for last 12 months (for chart)
        user_registrations = []
        for i in range(11, -1, -1):
            month_start = now.replace(day=1) - timedelta(days=i*30)
            month_end = month_start + timedelta(days=31)
            
            users = User.objects.filter(
                date_joined__gte=month_start,
                date_joined__lt=month_end,
                role='user'
            ).count()
            admins = User.objects.filter(
                date_joined__gte=month_start,
                date_joined__lt=month_end,
                role='admin'
            ).count()
            
            user_registrations.append({
                'month': month_start.strftime('%b'),
                'users': users,
                'admins': admins,
            })
        
        # Get destination categories breakdown
        destination_categories = []
        category_mapping = {
            'natural': 'Natural Attractions',
            'village_rural': 'Village & Rural Tourism',
            'cultural_religious': 'Cultural & Religious Sites',
            'urban_modern': 'Urban & Modern Attractions',
            'trekking_adventure': 'Trekking & Adventure',
            'wildlife_conservation': 'Wildlife & Conservation',
            'wellness_relaxation': 'Wellness & Relaxation',
        }
        
        for category_key, category_label in category_mapping.items():
            count = Destination.objects.filter(main_category=category_key).count()
            if count > 0:
                destination_categories.append({
                    'name': category_label,
                    'value': count,
                })
        
        # Convert imported numeric province values into the official names.
        province_names = {
            "1": "Koshi", "1.0": "Koshi", "koshi": "Koshi",
            "2": "Madhesh", "2.0": "Madhesh", "madhesh": "Madhesh",
            "3": "Bagmati", "3.0": "Bagmati", "bagmati": "Bagmati",
            "4": "Gandaki", "4.0": "Gandaki", "gandaki": "Gandaki",
            "5": "Lumbini", "5.0": "Lumbini", "lumbini": "Lumbini",
            "6": "Karnali", "6.0": "Karnali", "karnali": "Karnali",
            "7": "Sudurpashchim", "7.0": "Sudurpashchim", "sudurpashchim": "Sudurpashchim",
        }
        def province_name(value):
            normalized = str(value).strip().lower()
            return province_names.get(normalized, str(value).strip())

        province_totals = {}
        provinces = Destination.objects.values('province').annotate(count=Count('id')).order_by('-count')
        for item in provinces:
            if item['province']:
                name = province_name(item['province'])
                province_totals[name] = province_totals.get(name, 0) + item['count']
        province_distribution = [
            {'name': name, 'value': count}
            for name, count in sorted(province_totals.items(), key=lambda item: item[1], reverse=True)
        ]
        
        # Trending reflects actual detail-page interest this month, then reviews.
        trending_destinations = Destination.objects.annotate(
            monthly_views=Count('detail_views', filter=Q(detail_views__viewed_at__gte=current_month_start), distinct=True),
            monthly_reviews=Count('reviews', filter=Q(reviews__created_at__gte=current_month_start), distinct=True),
            monthly_average_rating=Avg('reviews__rating', filter=Q(reviews__created_at__gte=current_month_start)),
        ).order_by('-monthly_views', '-monthly_reviews', '-monthly_average_rating', 'name')[:3].values(
            'id', 'name', 'image_url', 'main_category', 'district', 'province',
            'ratings', 'monthly_views', 'monthly_reviews', 'monthly_average_rating'
        )
        trending_destinations = [
            {**destination, 'province': province_name(destination['province'])}
            for destination in trending_destinations
        ]
        
        # Keep the dashboard review ranking scoped to the current month.
        # The latest-reviews panel below intentionally remains all-time recent.
        most_reviewed = Destination.objects.filter(
            reviews__created_at__gte=current_month_start
        ).annotate(
            review_total=Count('reviews', filter=Q(reviews__created_at__gte=current_month_start))
        ).order_by('-review_total', 'name')[:6].values(
            'id', 'name', 'district', 'review_total'
        )
        
        # Get recent reviews
        recent_reviews = Review.objects.select_related("user", "destination").order_by("-created_at")[:5].values(
            "id", "rating", "comment", "created_at", "user__full_name", "user__email", "destination__name"
        )
        
        return Response({
            "users": total_users,
            "active_users": active_users,
            "destinations": Destination.objects.count(),
            "reviews": review_activity["this_month"],
            "overview_metrics": {
                "users": {"trend": monthly_totals(regular_users, "date_joined")},
                "destinations": {"trend": monthly_totals(Destination.objects.all(), "created_at")},
                "reviews": {**review_activity, "trend": monthly_counts(Review.objects.all(), "created_at")},
            },
            "user_registrations": user_registrations,
            "destination_categories": destination_categories,
            "province_distribution": province_distribution,
            "trending_destinations": trending_destinations,
            "most_reviewed": most_reviewed,
            "recent_reviews": recent_reviews,
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
