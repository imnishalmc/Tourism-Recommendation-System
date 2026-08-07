# destinations/models.py
from django.db import models
from django.conf import settings
from .constants import (
    MAIN_CATEGORY_CHOICES,
    DIFFICULTY_CHOICES,
    CROWD_LEVEL_CHOICES,
    BUDGET_LEVEL_CHOICES,
)
from django.db.models import Avg


class Destination(models.Model):
    name = models.CharField(max_length=200)
    district = models.CharField(max_length=100)
    province = models.CharField(max_length=100, blank=True)
    best_season = models.CharField(max_length=100, blank=True)

    main_category = models.CharField(max_length=30, choices=MAIN_CATEGORY_CHOICES)
    tags = models.JSONField(default=list, blank=True)
    activities = models.CharField(max_length=300, blank=True)
    difficulty_level = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES)
    accessibility = models.CharField(max_length=200, blank=True)
    transportation = models.TextField(blank=True)

    crowd_level = models.CharField(max_length=10, choices=CROWD_LEVEL_CHOICES)
    budget_level = models.CharField(max_length=10, choices=BUDGET_LEVEL_CHOICES)
    visit_duration_days = models.FloatField(default=0.25)

    latitude = models.FloatField()
    longitude = models.FloatField()

    description = models.TextField(blank=True)
    # destinations/models.py
    image_url = models.CharField(max_length=500, blank=True, default="")

    ratings = models.FloatField(null=True, blank=True)
    popularity = models.FloatField(null=True, blank=True)
    attraction_total_reviews = models.PositiveIntegerField(default=0)

    is_trek_entry = models.BooleanField(
        default=False
    )  # flags candidates linked to a TrekRoute

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
