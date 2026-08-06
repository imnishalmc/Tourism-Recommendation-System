from ml.services.recommendation_service import RecommendationService

recommendation_service = RecommendationService()


def get_recommendations(destination, category=None):
    return recommendation_service.get_recommendations(
        destination,
        category,
    )


def reload_recommendation_model():
    recommendation_service.load_model()