from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import DestinationViewSet, ReviewViewSet, RouteStageViewSet, TrekRouteViewSet

router = DefaultRouter()
router.register("destinations", DestinationViewSet, basename="destination")
router.register("reviews", ReviewViewSet, basename="review")
router.register("trek-routes", TrekRouteViewSet, basename="trek-route")
router.register("route-stages", RouteStageViewSet, basename="route-stage")

urlpatterns = [
    path("", include(router.urls)),
]
