from ml.services.recommendation_service import RecommendationService

service = RecommendationService()

destination = input("Destination: ")

recommendations = service.get_recommendations(destination)

print()

if recommendations is None:
    print("Destination not found.")

else:

    for recommendation in recommendations:

        print(
            recommendation["destination"],
            recommendation["match_score"],
        )