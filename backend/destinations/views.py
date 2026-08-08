from django.db.models import Avg, Count

from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from accounts.permissions import IsAdminRole

from ml.services.search_service import SearchService

from .models import Destination, Review, RouteStage, TrekRoute
from .serializers import (
    DestinationSerializer,
    ReviewSerializer,
    RouteStageSerializer,
    TrekRouteSerializer,
)


# Do not construct this at module import time. Django imports URL views before
# migration commands run, and the search service queries the destination table.
_search_service = None


def get_search_service():
    global _search_service
    if _search_service is None:
        _search_service = SearchService()
    return _search_service


class ReadOnlyOrAdminMixin:

    def get_permissions(self):

        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        return [IsAdminRole()]


class DestinationViewSet(
    ReadOnlyOrAdminMixin,
    viewsets.ModelViewSet,
):

    serializer_class = DestinationSerializer

    def get_queryset(self):

        search_service = get_search_service()

        queryset = Destination.objects.annotate(
            average_review_rating=Avg("reviews__rating"),
            review_count=Count("reviews"),
        ).order_by("name")

        search = self.request.query_params.get("search")
        main_category = self.request.query_params.get("main_category")
        district = self.request.query_params.get("district")
        difficulty_level = self.request.query_params.get(
            "difficulty_level"
        )
        budget_level = self.request.query_params.get("budget_level")
        crowd_level = self.request.query_params.get("crowd_level")
        is_trek_entry = self.request.query_params.get("is_trek_entry")
        is_featured = self.request.query_params.get("is_featured")

        if not search and not any(
            [
                main_category,
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

            trek_value = (
                is_trek_entry.lower() == "true"
            )

            results = results[
                results["is_trek_entry"] == trek_value
            ]

        if is_featured is not None:
            queryset = queryset.filter(
                is_featured=is_featured.lower() == "true"
            )

        if results.empty:
            return queryset.none()

        destination_names = (
            results["destination"]
            .astype(str)
            .tolist()
        )

        preserved_order = {
            name.lower(): index
            for index, name in enumerate(
                destination_names
            )
        }

        queryset = queryset.filter(
            name__in=destination_names
        )

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

        destination = self.request.query_params.get(
            "destination"
        )

        if destination:
            queryset = queryset.filter(
                destination_id=destination
            )

        return queryset

    def get_permissions(self):

        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated()]

        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user and self.request.user.role != "admin":
            raise PermissionDenied("You can only edit your own reviews.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user and self.request.user.role != "admin":
            raise PermissionDenied("You can only delete your own reviews.")
        instance.delete()


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

        difficulty_level = self.request.query_params.get(
            "difficulty_level"
        )

        max_days = self.request.query_params.get(
            "max_days"
        )

        if difficulty_level:
            queryset = queryset.filter(
                difficulty_level=difficulty_level
            )

        if max_days:
            queryset = queryset.filter(
                total_days__lte=max_days
            )

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

        queryset = RouteStage.objects.select_related(
            "route"
        ).order_by(
            "route",
            "day_number",
        )

        route = self.request.query_params.get(
            "route"
        )

        if route:
            queryset = queryset.filter(
                route_id=route
            )

        return queryset
