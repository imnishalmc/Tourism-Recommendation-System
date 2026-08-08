from ml.services.recommendation_service import RecommendationService

_recommendation_service = None


def get_recommendation_service():
    """Create the DB-backed model only when an API request needs it.

    This keeps Django's management commands (especially migrations) from
    querying models before their latest schema has been applied.
    """
    global _recommendation_service
    if _recommendation_service is None:
        _recommendation_service = RecommendationService()
    return _recommendation_service


def get_recommendations(destination, category=None):
    return get_recommendation_service().get_recommendations(
        destination,
        category,
    )


def reload_recommendation_model():
    get_recommendation_service().load_model()
