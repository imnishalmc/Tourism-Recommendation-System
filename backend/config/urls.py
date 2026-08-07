from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    path("v1/accounts/", include("accounts.urls")),
    path("v1/accounts/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"
    ),

    path("v1/", include("destinations.urls")),

    path("v1/recommend/", include("recommendations.urls")),
    path("v1/itinerary/",include("itinerary.urls"),
),
]