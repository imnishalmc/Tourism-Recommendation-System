from rest_framework import serializers


class RecommendationSerializer(serializers.Serializer):
    destination = serializers.CharField()
    district = serializers.CharField()
    province = serializers.CharField()
    main_category = serializers.CharField()
    ratings = serializers.FloatField()
    popularity = serializers.IntegerField()
    match_score = serializers.FloatField()