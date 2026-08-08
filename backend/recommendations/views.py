from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from destinations.models import Destination

from .services import get_recommendations


def _enrich(entry):
    """The ML similarity model only returns name/district/province/category/
    ratings/popularity — it has no idea about images, badges, or descriptions.
    Match the recommended name back to a real Destination row so the frontend
    card has something to render and link to."""
    if not entry:
        return entry

    match = Destination.objects.filter(name__iexact=entry.get("destination", "")).first()

    entry["id"] = match.id if match else None
    entry["image_url"] = match.image_url if match else None
    entry["difficulty_level"] = match.difficulty_level if match else None
    entry["crowd_level"] = match.crowd_level if match else None
    entry["budget_level"] = match.budget_level if match else None
    entry["description"] = match.description if match else None

    return entry


class RecommendationAPIView(APIView):
    # Public, e-commerce-style — "you might also like" doesn't require login
    permission_classes = [AllowAny]

    def post(self, request):
        destination_id = request.data.get("destination_id")
        category = request.data.get("category")

        if not destination_id:
            return Response({"error": "destination_id parameter is required"}, status=400)

        try:
            destination = Destination.objects.get(id=destination_id)
        except Destination.DoesNotExist:
            return Response({"error": "Destination not found"}, status=404)

        result = get_recommendations(destination=destination, category=category)

        if result is None:
            return Response({"error": "No recommendations found"}, status=404)

        if "matched_destination" in result:
            result["matched_destination"] = _enrich(result["matched_destination"])
        if "recommendations" in result:
            result["recommendations"] = [_enrich(r) for r in result["recommendations"]]

        return Response(result)