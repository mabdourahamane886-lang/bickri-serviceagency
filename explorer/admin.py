from django.contrib import admin

from .models import MediaGalerie, Merveille, Region


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("nom", "slug")
    prepopulated_fields = {"slug": ("nom",)}
    search_fields = ("nom",)


@admin.register(Merveille)
class MerveilleAdmin(admin.ModelAdmin):
    list_display = (
        "titre",
        "region",
        "categorie",
        "est_a_la_une",
        "publie",
        "cree_le",
    )
    list_filter = ("region", "categorie", "est_a_la_une", "publie")
    search_fields = ("titre", "resume", "contenu")
    prepopulated_fields = {"slug": ("titre",)}


@admin.register(MediaGalerie)
class MediaGalerieAdmin(admin.ModelAdmin):
    list_display = ("titre", "type_media", "region", "publie")
    list_filter = ("type_media", "region", "publie")
    search_fields = ("titre", "legende", "credit")
