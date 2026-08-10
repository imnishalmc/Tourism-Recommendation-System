from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Avg, Count

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from accounts.permissions import IsAdminRole

from ml.services.search_service import SearchService
import threading
from .models import Destination, DestinationView, Review, RouteStage, TrekRoute
from .serializers import (
    DestinationSerializer,
    ReviewSerializer,
    RouteStageSerializer,
    TrekRouteSerializer,
)

User = get_user_model()
_search_service = None
_search_service_lock = threading.Lock()


def get_search_service():
    global _search_service
    if _search_service is None:
        with _search_service_lock:
            if _search_service is None:
                _search_service = SearchService()
    return _search_service


class ReadOnlyOrAdminMixin:
    def get_permissions(self):

        if self.action in ["list", "retrieve", "record_view"]:
            return [AllowAny()]

        return [IsAdminRole()]


class SiteStatsView(APIView):
    """
    Public statistics used by the homepage.

    Returns real values from the database instead of hardcoded numbers.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        destination_count = Destination.objects.count()

        route_count = TrekRoute.objects.count()

        province_count = (
            Destination.objects.exclude(province__isnull=True)
            .exclude(province__exact="")
            .values("province")
            .distinct()
            .count()
        )

        registered_traveler_count = User.objects.count()

        return Response(
            {
                "destinations": destination_count,
                "travel_routes": route_count,
                "provinces_covered": province_count,
                "registered_travelers": registered_traveler_count,
            }
        )


class DestinationViewSet(
    ReadOnlyOrAdminMixin,
    viewsets.ModelViewSet,
):
    serializer_class = DestinationSerializer

    @action(detail=True, methods=["post"], permission_classes=[AllowAny])
    def record_view(self, request, pk=None):
        """Record a detail-page visit without making page viewing require sign-in."""
        destination = self.get_object()
        DestinationView.objects.create(destination=destination)
        return Response(status=204)

    def get_queryset(self):

        search_service = get_search_service()

        queryset = Destination.objects.annotate(
            average_review_rating=Avg("reviews__rating"),
            review_count=Count("reviews"),
        ).order_by("name")

        search = self.request.query_params.get("search")
        main_category = self.request.query_params.get("main_category")
        province = self.request.query_params.get("province")
        district = self.request.query_params.get("district")
        difficulty_level = self.request.query_params.get("difficulty_level")
        budget_level = self.request.query_params.get("budget_level")
        crowd_level = self.request.query_params.get("crowd_level")
        is_trek_entry = self.request.query_params.get("is_trek_entry")
        is_featured = self.request.query_params.get("is_featured")

        if not search and not any(
            [
                main_category,
                province,
                district,
                difficulty_level,
                crowd_level,
                budget_level,
                is_trek_entry,
                is_featured,
            ]
        ):
            return queryset

        if search:
            results = search_service.search(
                query=search,
                category=main_category,
                province=province,
                district=district,
                difficulty=difficulty_level,
                budget=budget_level,
                crowd=crowd_level,
                is_trek_entry=is_trek_entry,
            )

        else:
            results = search_service.df.copy()

            if main_category:
                results = search_service.search_filter.filter_by_category(
                    results,
                    main_category,
                )

            if province:
                results = search_service.search_filter.filter_by_province(
                    results,
                    province,
                )

            if district:
                results = results[
                    results["district"]
                    .astype(str)
                    .str.lower()
                    .eq(district.strip().lower())
                ]

            if difficulty_level:
                results = results[
                    results["difficulty_level"]
                    .astype(str)
                    .str.lower()
                    .eq(difficulty_level.strip().lower())
                ]

            if budget_level:
                results = results[
                    results["budget_level"]
                    .astype(str)
                    .str.lower()
                    .eq(budget_level.strip().lower())
                ]

            if crowd_level:
                results = results[
                    results["crowd_level"]
                    .astype(str)
                    .str.lower()
                    .eq(crowd_level.strip().lower())
                ]

        if is_trek_entry is not None:
            trek_value = is_trek_entry.lower() == "true"

            results = results[results["is_trek_entry"] == trek_value]

        if is_featured is not None:
            queryset = queryset.filter(is_featured=is_featured.lower() == "true")

        if results.empty:
            return queryset.none()

        destination_names = results["destination"].astype(str).tolist()

        preserved_order = {
            name.lower(): index for index, name in enumerate(destination_names)
        }

        queryset = queryset.filter(name__in=destination_names)

        queryset = sorted(
            queryset,
            key=lambda destination: preserved_order.get(
                destination.name.lower(),
                len(preserved_order),
            ),
        )

        return queryset


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):

        queryset = Review.objects.select_related(
            "destination",
            "user",
        ).order_by("-created_at")

        destination = self.request.query_params.get("destination")

        if destination:
            queryset = queryset.filter(destination_id=destination)

        return queryset

    def get_permissions(self):

        if self.action in ["list", "retrieve", "record_view"]:
            return [AllowAny()]

        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated()]

        return [AllowAny()]

    @staticmethod
    def _update_destination_summary(destination_id, rating_delta, review_delta):
        """Update the destination's persisted rating and review total safely.

        ``ratings`` and ``attraction_total_reviews`` may contain imported
        historical data.  Each traveller review is therefore merged into that
        existing weighted average rather than replacing it.
        """
        destination = Destination.objects.select_for_update().get(pk=destination_id)
        previous_count = destination.attraction_total_reviews or 0
        previous_average = destination.ratings
        new_count = max(previous_count + review_delta, 0)

        if new_count == 0:
            destination.ratings = None
        elif previous_average is None:
            # There is no usable prior average to weight, so begin with the
            # first available traveller rating.
            destination.ratings = round(rating_delta / max(review_delta, 1), 2)
        else:
            destination.ratings = round(
                ((previous_average * previous_count) + rating_delta) / new_count,
                2,
            )

        destination.attraction_total_reviews = new_count
        destination.save(update_fields=["ratings", "attraction_total_reviews"])

    def perform_create(self, serializer):
        with transaction.atomic():
            review = serializer.save(user=self.request.user)
            self._update_destination_summary(
                review.destination_id, rating_delta=review.rating, review_delta=1
            )

    def perform_update(self, serializer):
        if (
            serializer.instance.user != self.request.user
            and self.request.user.role != "admin"
        ):
            raise PermissionDenied("You can only edit your own reviews.")
        previous_rating = serializer.instance.rating
        previous_destination_id = serializer.instance.destination_id
        with transaction.atomic():
            review = serializer.save()
            if review.destination_id == previous_destination_id:
                self._update_destination_summary(
                    review.destination_id,
                    rating_delta=review.rating - previous_rating,
                    review_delta=0,
                )
            else:
                self._update_destination_summary(
                    previous_destination_id,
                    rating_delta=-previous_rating,
                    review_delta=-1,
                )
                self._update_destination_summary(
                    review.destination_id, rating_delta=review.rating, review_delta=1
                )

    def perform_destroy(self, instance):
        if instance.user != self.request.user and self.request.user.role != "admin":
            raise PermissionDenied("You can only delete your own reviews.")
        with transaction.atomic():
            destination_id, rating = instance.destination_id, instance.rating
            instance.delete()
            self._update_destination_summary(
                destination_id, rating_delta=-rating, review_delta=-1
            )


class TrekRouteViewSet(
    ReadOnlyOrAdminMixin,
    viewsets.ModelViewSet,
):
    serializer_class = TrekRouteSerializer

    def get_queryset(self):

        queryset = TrekRoute.objects.select_related(
            "entry_destination",
            "exit_destination",
        ).prefetch_related("stages")

        difficulty_level = self.request.query_params.get("difficulty_level")

        max_days = self.request.query_params.get("max_days")

        if difficulty_level:
            queryset = queryset.filter(difficulty_level=difficulty_level)

        if max_days:
            queryset = queryset.filter(total_days__lte=max_days)

        return queryset.order_by(
            "total_days",
            "name",
        )


class RouteStageViewSet(
    ReadOnlyOrAdminMixin,
    viewsets.ModelViewSet,
):
    serializer_class = RouteStageSerializer

    def get_queryset(self):

        queryset = RouteStage.objects.select_related("route").order_by(
            "route",
            "day_number",
        )

        route = self.request.query_params.get("route")

        if route:
            queryset = queryset.filter(route_id=route)

        return queryset
