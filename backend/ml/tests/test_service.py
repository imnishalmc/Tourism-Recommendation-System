import pytest

from destinations.models import Destination
from ml.services.recommendation_service import RecommendationService


@pytest.mark.django_db
def test_service_loads_model():

    Destination.objects.create(
        name="Pokhara",
        district="Kaski",
        province="Gandaki",
        best_season="Autumn",
        main_category="Nature",
        tags=["Lake", "Nature"],
        activities="Boating",
        difficulty_level="Easy",
        accessibility="Easy",
        transportation="Bus",
        crowd_level="Low",
        budget_level="Medium",
        visit_duration_days=2,
        latitude=28.2096,
        longitude=83.9856,
        description="Beautiful lake city with boating and mountain views.",
        image_url="",
        ratings=4.8,
        popularity=95,
        attraction_total_reviews=12,
        is_trek_entry=False,
    )

    Destination.objects.create(
        name="Begnas Lake",
        district="Kaski",
        province="Gandaki",
        best_season="Autumn",
        main_category="Nature",
        tags=["Lake", "Boating"],
        activities="Boating, Kayaking",
        difficulty_level="Easy",
        accessibility="Easy",
        transportation="Bus",
        crowd_level="Low",
        budget_level="Medium",
        visit_duration_days=1,
        latitude=28.2450,
        longitude=84.1000,
        description="Peaceful lake ideal for boating and relaxing.",
        image_url="",
        ratings=4.6,
        popularity=82,
        attraction_total_reviews=900,
        is_trek_entry=False,
    )

    Destination.objects.create(
        name="Chitwan National Park",
        district="Chitwan",
        province="Bagmati",
        best_season="Winter",
        main_category="Wildlife",
        tags=["Safari", "Jungle"],
        activities="Jungle Safari",
        difficulty_level="Easy",
        accessibility="Easy",
        transportation="Bus",
        crowd_level="Medium",
        budget_level="Medium",
        visit_duration_days=3,
        latitude=27.5341,
        longitude=84.3542,
        description="National park famous for wildlife safari.",
        image_url="",
        ratings=4.7,
        popularity=90,
        attraction_total_reviews=1100,
        is_trek_entry=False,
    )

    service = RecommendationService()

    recommendations = service.get_recommendations("Pokhara")

    print("\n========== Recommendation Output ==========")
    print(recommendations)
    print("===========================================\n")

    assert recommendations is not None
    assert recommendations["matched_destination"]["destination"] == "Pokhara"
    assert len(recommendations["recommendations"]) >= 1

    first = recommendations["recommendations"][0]

    print(f"Top Recommendation : {first['destination']}")
    print(f"Match Score        : {first['match_score']}%")