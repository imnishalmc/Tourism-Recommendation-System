from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .services import get_recommendations


class RecommendationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        destination = request.GET.get("destination")

        if not destination:
            return Response(
                {"error": "destination parameter is required"},
                status=400
            )

        recommendations = get_recommendations(destination)

        if recommendations is None:
            return Response(
                {"error": "Destination not found"},
                status=404
            )

        return Response(recommendations)