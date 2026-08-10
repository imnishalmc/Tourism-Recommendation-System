from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from destinations.models import Destination

from .services import get_recommendations


class RecommendationAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        destination_id = request.data.get("destination_id")
        category = request.data.get("category")

        if not destination_id:
            return Response(
                {"error": "destination_id parameter is required"},
                status=400,
            )

        try:
            destination = Destination.objects.get(id=destination_id)
        except Destination.DoesNotExist:
            return Response(
                {"error": "Destination not found"},
                status=404,
            )

        recommendations = get_recommendations(
            destination=destination,
            category=category,
        )

        if recommendations is None:
            return Response(
                {"error": "No recommendations found"},
                status=404,
            )

        return Response(recommendations)