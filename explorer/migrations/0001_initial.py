from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Region",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("nom", models.CharField(max_length=100, unique=True)),
                ("slug", models.SlugField(blank=True, unique=True)),
                ("resume", models.TextField()),
                ("histoire", models.TextField(blank=True)),
                ("image_couverture", models.ImageField(blank=True, null=True, upload_to="regions/")),
            ],
            options={"ordering": ["nom"], "verbose_name": "Région", "verbose_name_plural": "Régions"},
        ),
        migrations.CreateModel(
            name="Merveille",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("titre", models.CharField(max_length=200)),
                ("slug", models.SlugField(blank=True, unique=True)),
                ("categorie", models.CharField(choices=[("desert", "Déserts & Sahara"), ("paysage", "Montagnes & paysages"), ("nature", "Faune & nature"), ("patrimoine", "Patrimoine historique"), ("culture", "Cultures & traditions"), ("gastronomie", "Gastronomie"), ("artisanat", "Artisanat"), ("peuples", "Peuples du Niger")], max_length=30)),
                ("resume", models.TextField()),
                ("contenu", models.TextField()),
                ("image_principale", models.ImageField(blank=True, null=True, upload_to="merveilles/")),
                ("credit_photo", models.CharField(blank=True, help_text="Exemple : Photo : Nom du photographe — CC BY-SA 4.0", max_length=255)),
                ("source_photo", models.URLField(blank=True, help_text="Lien vers la page de licence ou la source originale")),
                ("video_url", models.URLField(blank=True, help_text="Lien YouTube, Vimeo ou autre vidéo autorisée")),
                ("est_a_la_une", models.BooleanField(default=False)),
                ("publie", models.BooleanField(default=True)),
                ("cree_le", models.DateTimeField(auto_now_add=True)),
                ("region", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="merveilles", to="explorer.region")),
            ],
            options={"ordering": ["-cree_le"], "verbose_name": "Merveille", "verbose_name_plural": "Merveilles"},
        ),
        migrations.CreateModel(
            name="MediaGalerie",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("titre", models.CharField(max_length=200)),
                ("type_media", models.CharField(choices=[("image", "Photo"), ("video", "Vidéo")], max_length=10)),
                ("image", models.ImageField(blank=True, null=True, upload_to="galerie/")),
                ("video_url", models.URLField(blank=True)),
                ("legende", models.TextField(blank=True)),
                ("credit", models.CharField(blank=True, max_length=255)),
                ("source", models.URLField(blank=True)),
                ("publie", models.BooleanField(default=True)),
                ("region", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="medias", to="explorer.region")),
            ],
            options={"verbose_name": "Média", "verbose_name_plural": "Galerie"},
        ),
    ]
