# destinations/views.py
from django.db.models import Avg, Count, Q
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.filters import SearchFilter
from accounts.permissions import IsAdminRole, IsOwnerOrReadOnly
from .models import Destination, Review, RouteStage, TrekRoute
from .serializers import (
    DestinationSerializer,
    ReviewSerializer,
    RouteStageSerializer,
    TrekRouteSerializer,
)


class ReadOnlyOrAdminMixin:
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminRole()]


class DestinationViewSet(ReadOnlyOrAdminMixin, viewsets.ModelViewSet):
    serializer_class = DestinationSerializer

    # Fields users are allowed to order by
    ALLOWED_ORDERING_FIELDS = [
        "name",
        "ratings",
        "popularity",
        "average_review_rating",
        "review_count",
        "visit_duration_days",
        "created_at",
    ]

    def get_queryset(self):
        queryset = Destination.objects.annotate(
            average_review_rating=Avg("reviews__rating"),
            review_count=Count("reviews"),
        ).all()

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(name__icontains=search)

        main_category = self.request.query_params.get("main_category")
        district = self.request.query_params.get("district")
        difficulty_level = self.request.query_params.get("difficulty_level")
        budget_level = self.request.query_params.get("budget_level")
        is_trek_entry = self.request.query_params.get("is_trek_entry")

        if main_category:
            queryset = queryset.filter(main_category=main_category)

        if district:
            queryset = queryset.filter(district__iexact=district)

        if difficulty_level:
            queryset = queryset.filter(difficulty_level=difficulty_level)

        if budget_level:
            queryset = queryset.filter(budget_level=budget_level)

        if is_trek_entry is not None:
            queryset = queryset.filter(is_trek_entry=is_trek_entry.lower() == "true")

        ordering = self.request.query_params.get("ordering")

        if ordering:
            field_name = ordering.lstrip("-")

            if field_name in self.ALLOWED_ORDERING_FIELDS:
                queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by("name")

        return queryset


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = Review.objects.select_related("destination", "user").order_by(
            "-created_at"
        )
        destination = self.request.query_params.get("destination")
        if destination:
            queryset = queryset.filter(destination_id=destination)
        return queryset

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        if self.action == "create":
            return [IsAuthenticated()]
        # update / partial_update / destroy — must be authenticated AND own the review
        return [IsAuthenticated(), IsOwnerOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TrekRouteViewSet(ReadOnlyOrAdminMixin, viewsets.ModelViewSet):
    serializer_class = TrekRouteSerializer

    def get_queryset(self):
        queryset = TrekRoute.objects.select_related(
            "entry_destination", "exit_destination"
        ).prefetch_related("stages")

        difficulty_level = self.request.query_params.get("difficulty_level")
        max_days = self.request.query_params.get("max_days")

        if difficulty_level:
            queryset = queryset.filter(difficulty_level=difficulty_level)
        if max_days:
            try:
                queryset = queryset.filter(total_days__lte=int(max_days))
            except ValueError:
                pass  # ignore invalid input rather than crash with a 500

        return queryset.order_by("total_days", "name")


class RouteStageViewSet(ReadOnlyOrAdminMixin, viewsets.ModelViewSet):
    serializer_class = RouteStageSerializer

    def get_queryset(self):
        queryset = RouteStage.objects.select_related("route").order_by(
            "route", "day_number"
        )
        route = self.request.query_params.get("route")
        if route:
            queryset = queryset.filter(route_id=route)
        return queryset
