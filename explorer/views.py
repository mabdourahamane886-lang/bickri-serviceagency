from django.shortcuts import get_object_or_404, render

from .models import MediaGalerie, Merveille, Region


def accueil(request):
    merveilles_publiees = Merveille.objects.filter(
        publie=True
    ).select_related("region")
    context = {
        "regions": Region.objects.all(),
        "regions_count": Region.objects.count(),
        "merveilles_count": Merveille.objects.filter(publie=True).count(),
        "a_la_une": merveilles_publiees.filter(est_a_la_une=True)[:6],
        "medias": MediaGalerie.objects.filter(publie=True).select_related("region")[:12],
    }
    if not context["a_la_une"]:
        context["a_la_une"] = merveilles_publiees[:6]
    return render(request, "explorer/accueil.html", context)


def region_detail(request, slug):
    region = get_object_or_404(Region, slug=slug)
    return render(
        request,
        "explorer/region_detail.html",
        {
            "region": region,
            "merveilles": region.merveilles.filter(publie=True),
            "medias": region.medias.filter(publie=True),
        },
    )


def merveille_detail(request, slug):
    merveille = get_object_or_404(Merveille, slug=slug, publie=True)
    return render(
        request,
        "explorer/merveille_detail.html",
        {"merveille": merveille},
    )
