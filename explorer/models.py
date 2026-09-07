from django.db import models
from django.utils.text import slugify


class Region(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    resume = models.TextField()
    histoire = models.TextField(blank=True)
    image_couverture = models.ImageField(upload_to="regions/", blank=True, null=True)

    class Meta:
        ordering = ["nom"]
        verbose_name = "Région"
        verbose_name_plural = "Régions"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nom)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nom


class Merveille(models.Model):
    CATEGORIES = [
        ("desert", "Déserts & Sahara"),
        ("paysage", "Montagnes & paysages"),
        ("nature", "Faune & nature"),
        ("patrimoine", "Patrimoine historique"),
        ("culture", "Cultures & traditions"),
        ("gastronomie", "Gastronomie"),
        ("artisanat", "Artisanat"),
        ("peuples", "Peuples du Niger"),
    ]

    titre = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name="merveilles")
    categorie = models.CharField(max_length=30, choices=CATEGORIES)
    resume = models.TextField()
    contenu = models.TextField()
    image_principale = models.ImageField(upload_to="merveilles/", blank=True, null=True)
    credit_photo = models.CharField(
        max_length=255,
        blank=True,
        help_text="Exemple : Photo : Nom du photographe — CC BY-SA 4.0",
    )
    source_photo = models.URLField(blank=True, help_text="Lien vers la page de licence ou la source originale")
    video_url = models.URLField(blank=True, help_text="Lien YouTube, Vimeo ou autre vidéo autorisée")
    est_a_la_une = models.BooleanField(default=False)
    publie = models.BooleanField(default=True)
    cree_le = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-cree_le"]
        verbose_name = "Merveille"
        verbose_name_plural = "Merveilles"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titre


class MediaGalerie(models.Model):
    TYPES = [("image", "Photo"), ("video", "Vidéo")]

    titre = models.CharField(max_length=200)
    type_media = models.CharField(max_length=10, choices=TYPES)
    region = models.ForeignKey(
        Region, on_delete=models.SET_NULL, null=True, blank=True, related_name="medias"
    )
    image = models.ImageField(upload_to="galerie/", blank=True, null=True)
    video_url = models.URLField(blank=True)
    legende = models.TextField(blank=True)
    credit = models.CharField(max_length=255, blank=True)
    source = models.URLField(blank=True)
    publie = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Média"
        verbose_name_plural = "Galerie"

    def __str__(self):
        return self.titre
