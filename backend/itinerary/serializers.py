from rest_framework import serializers


class ItinerarySerializer(serializers.Serializer):

    destination = serializers.CharField()

    days = serializers.IntegerField(
        min_value=1
    )

    budget = serializers.CharField()

    travelers = serializers.IntegerField(
        required=False,
        default=1,
        min_value=1
    )

    pace = serializers.CharField(
        required=False,
        default="moderate",
        allow_blank=True
    )

    interests = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )

    starting_location = serializers.CharField(
        required=False,
        allow_blank=True
    )

    latitude = serializers.FloatField(
        required=False
    )

    longitude = serializers.FloatField(
        required=False
    )