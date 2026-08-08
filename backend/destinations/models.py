# destinations/models.py
from django.db import models
from django.conf import settings
from .constants import (
    MAIN_CATEGORY_CHOICES,
    DIFFICULTY_CHOICES,
    CROWD_LEVEL_CHOICES,
    BUDGET_LEVEL_CHOICES,
)


class Destination(models.Model):
    name = models.CharField(max_length=200)
    district = models.CharField(max_length=100)
    province = models.CharField(max_length=100, blank=True)
    best_season = models.CharField(max_length=100, blank=True)

    main_category = models.CharField(max_length=30, choices=MAIN_CATEGORY_CHOICES)
    tags = models.JSONField(
        default=list, blank=True
    )  # display/search only, not the similarity vector
    activities = models.CharField(max_length=300, blank=True)
    difficulty_level = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES)
    accessibility = models.CharField(max_length=200, blank=True)
    transportation = models.TextField(blank=True)

    crowd_level = models.CharField(max_length=10, choices=CROWD_LEVEL_CHOICES)
    budget_level = models.CharField(
        max_length=10, choices=BUDGET_LEVEL_CHOICES
    )  # derived, not from raw CSV
    visit_duration_days = models.FloatField(default=0.25)  # derived, not from raw CSV

    latitude = models.FloatField()
    longitude = models.FloatField()

    description = models.TextField(blank=True)
    # Images can be an external URL, a local path, or imported base64 image data.
    image_url = models.TextField(blank=True)

    ratings = models.FloatField(null=True, blank=True)
    popularity = models.FloatField(null=True, blank=True)
    attraction_total_reviews = models.PositiveIntegerField(default=0)

    is_trek_entry = models.BooleanField(
        default=False
    )  # flags candidates linked to a TrekRoute
    is_featured = models.BooleanField(
        default=False
    )  # explicitly selected for the popular destinations homepage section

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.tags is None:
            self.tags = []
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Review(models.Model):
    destination = models.ForeignKey(
        Destination, related_name="reviews", on_delete=models.CASCADE
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} -> {self.destination} ({self.rating}/5)"


class DestinationView(models.Model):
    """A lightweight event recorded whenever a traveller opens a detail page."""
    destination = models.ForeignKey(
        Destination, related_name="detail_views", on_delete=models.CASCADE
    )
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-viewed_at"]


class TrekRoute(models.Model):
    name = models.CharField(max_length=200)
    entry_destination = models.ForeignKey(
        Destination, related_name="routes_starting_here", on_delete=models.CASCADE
    )
    exit_destination = models.ForeignKey(
        Destination, related_name="routes_ending_here", on_delete=models.CASCADE
    )
    total_days = models.PositiveIntegerField()
    difficulty_level = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class RouteStage(models.Model):
    route = models.ForeignKey(
        TrekRoute, related_name="stages", on_delete=models.CASCADE
    )
    day_number = models.PositiveIntegerField()
    name = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    description = models.TextField(blank=True)
    overnight_stop = models.BooleanField(default=True)

    class Meta:
        ordering = ["route", "day_number"]

    def __str__(self):
        return f"{self.route.name} - Day {self.day_number}: {self.name}"
