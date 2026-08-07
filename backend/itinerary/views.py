from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import ItinerarySerializer
from .services import ItineraryService


class GenerateItineraryView(APIView):

    def post(self, request):

        serializer = ItinerarySerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        service = ItineraryService()

        itinerary = service.generate(
            **serializer.validated_data
        )

        return Response(itinerary)