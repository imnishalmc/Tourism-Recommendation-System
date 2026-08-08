from rest_framework import serializers

from .models import Destination, Review, RouteStage, TrekRoute


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    destination_name = serializers.CharField(source="destination.name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "destination",
            "destination_name",
            "user",
            "user_name",
            "user_email",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["id", "user", "user_name", "user_email", "created_at"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class DestinationSerializer(serializers.ModelSerializer):
    # A CharField deliberately permits imported base64 data and local image paths,
    # in addition to normal http(s) URLs.
    image_url = serializers.CharField(required=False, allow_blank=True)
    average_review_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Destination
        fields = [
            "id",
            "name",
            "district",
            "province",
            "best_season",
            "main_category",
            "tags",
            "activities",
            "difficulty_level",
            "accessibility",
            "transportation",
            "crowd_level",
            "budget_level",
            "visit_duration_days",
            "latitude",
            "longitude",
            "description",
            "image_url",
            "ratings",
            "popularity",
            "attraction_total_reviews",
            "is_trek_entry",
            "is_featured",
            "average_review_rating",
            "review_count",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "average_review_rating",
            "review_count",
            "created_at",
        ]

    def validate_main_category(self, value):
        # Accept the concise labels used by the administration form.
        aliases = {
            "nature": "natural",
            "culture": "cultural_religious",
            "adventure": "trekking_adventure",
            "religious": "cultural_religious",
        }
        return aliases.get(value, value)

    def validate(self, attrs):
        # An unchanged local image is sometimes represented by an empty form
        # field. Do not erase an existing image when the administrator saves
        # other destination details.
        if (
            self.instance
            and attrs.get("image_url") == ""
            and self.instance.image_url
        ):
            attrs.pop("image_url")
        if not self.instance:
            # These are internal recommendation values, not fields admins need
            # to enter when adding a dataset-style destination.
            attrs.setdefault("latitude", 0)
            attrs.setdefault("longitude", 0)
            attrs.setdefault("budget_level", "medium")
        return attrs

    def validate_ratings(self, value):
        return value


class RouteStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteStage
        fields = [
            "id",
            "route",
            "day_number",
            "name",
            "latitude",
            "longitude",
            "description",
            "overnight_stop",
        ]
        read_only_fields = ["id"]


class TrekRouteSerializer(serializers.ModelSerializer):
    stages = RouteStageSerializer(many=True, read_only=True)
    entry_destination_name = serializers.CharField(
        source="entry_destination.name", read_only=True
    )
    exit_destination_name = serializers.CharField(
        source="exit_destination.name", read_only=True
    )

    class Meta:
        model = TrekRoute
        fields = [
            "id",
            "name",
            "entry_destination",
            "entry_destination_name",
            "exit_destination",
            "exit_destination_name",
            "total_days",
            "difficulty_level",
            "description",
            "stages",
        ]
        read_only_fields = ["id", "entry_destination_name", "exit_destination_name"]
