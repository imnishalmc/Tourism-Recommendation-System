from django.db.models import Avg, Count, Q
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from accounts.permissions import IsAdminRole
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

    def get_queryset(self):
        queryset = Destination.objects.annotate(
            average_review_rating=Avg("reviews__rating"),
            review_count=Count("reviews"),
        ).order_by("name")

        search = self.request.query_params.get("search")
        main_category = self.request.query_params.get("main_category")
        district = self.request.query_params.get("district")
        difficulty_level = self.request.query_params.get("difficulty_level")
        budget_level = self.request.query_params.get("budget_level")
        is_trek_entry = self.request.query_params.get("is_trek_entry")

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(district__icontains=search)
                | Q(province__icontains=search)
                | Q(description__icontains=search)
                | Q(activities__icontains=search)
            )
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
        return [IsAuthenticated()]

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
            queryset = queryset.filter(total_days__lte=max_days)

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
