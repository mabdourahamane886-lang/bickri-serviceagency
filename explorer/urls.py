from django.urls import path
from . import views

app_name = "explorer"

urlpatterns = [
    path("", views.accueil, name="accueil"),
    path("regions/<slug:slug>/", views.region_detail, name="region_detail"),
    path("merveilles/<slug:slug>/", views.merveille_detail, name="merveille_detail"),
]
