from django.contrib import admin
from .models import Destination, Review, TrekRoute, RouteStage


class RouteStageInline(admin.TabularInline):  # TODO learn about this
    """Lets you add/edit a route's stages directly on the TrekRoute admin page,
    instead of jumping to a separate screen for each stage."""

    model = RouteStage
    extra = 1
    ordering = ["day_number"]


@admin.register(
    Destination
)  # this is decorator, a cleaner way to register the model and customize how it appears.
class DestinationAdmin(admin.ModelAdmin):
    list_display = (  # list display helps to show data in a cleaner way in the admin panel
        "name",
        "district",
        "province",
        "ratings",
        "main_category",
        "difficulty_level",
        "crowd_level",
        "budget_level",
        "is_trek_entry",
    )
    list_filter = (
        "main_category",
        "difficulty_level",
        "crowd_level",
        "budget_level",
        "is_trek_entry",
    )
    search_fields = ("name", "district", "province")
    ordering = ("name",)  # show the destination alphabetically
    list_per_page = 50


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("destination", "user", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("destination__name", "user__email")


@admin.register(TrekRoute)
class TrekRouteAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "entry_destination",
        "exit_destination",
        "total_days",
        "difficulty_level",
    )
    inlines = [RouteStageInline]


@admin.register(RouteStage)
class RouteStageAdmin(admin.ModelAdmin):
    list_display = ("route", "day_number", "name", "overnight_stop")
    list_filter = ("overnight_stop", "route")
    search_fields = ("name", "route__name")
    ordering = ("route", "day_number")
