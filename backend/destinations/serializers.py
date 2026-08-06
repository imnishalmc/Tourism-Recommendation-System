from rest_framework import serializers

from .models import Destination, Review, RouteStage, TrekRoute


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "destination",
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
