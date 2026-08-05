from rest_framework import serializers


class ItinerarySerializer(serializers.Serializer):

    destination = serializers.CharField()

    days = serializers.IntegerField()

    budget = serializers.IntegerField()

    travelers = serializers.IntegerField()

    pace = serializers.CharField()

    interests = serializers.ListField(
        child=serializers.CharField()
    )