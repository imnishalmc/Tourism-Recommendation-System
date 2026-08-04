# recommendations/services.py

from ml.services.recommendation_service import RecommendationService

recommendation_service = RecommendationService()


def get_recommendations(destination):
    return recommendation_service.get_recommendations(destination)