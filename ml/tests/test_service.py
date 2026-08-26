from ml.services.recommendation_service import RecommendationService

service = RecommendationService()

destination = input("Enter destination: ")

results = service.get_recommendations(destination)

if results is None:
    print("Destination not found.")
else:
    for place in results:
        print(place)