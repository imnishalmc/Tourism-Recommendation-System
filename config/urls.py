from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    path("v1/accounts/", include("accounts.urls")),

    path("v1/", include("destinations.urls")),

    path("v1/recommend/", include("recommendations.urls")),
]