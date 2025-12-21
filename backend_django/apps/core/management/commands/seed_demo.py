from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from apps.core.models import (
    Enterprise,
    Farm,
    Membership,
    Species,
    Unit,
    Lot,
    LotDailyRecord,
    HealthEvent,
    StockItem,
)


class Command(BaseCommand):
    help = "Seed demo data (user, enterprise, farm, unit, lot, health, stock)"

    def handle(self, *args, **options):
        User = get_user_model()

        demo_email = "demo@example.com"
        demo_password = "demo1234"

        user, created = User.objects.get_or_create(email=demo_email, defaults={"is_staff": True})
        if created:
            user.set_password(demo_password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Utilisateur créé: {demo_email} / {demo_password}"))
        else:
            self.stdout.write(self.style.WARNING(f"Utilisateur déjà présent: {demo_email}"))

        # Species seeds (if missing)
        species_codes = {
            "poultry": "Volaille",
            "pig": "Porcin",
            "cattle": "Bovin",
        }
        for code, name in species_codes.items():
            Species.objects.get_or_create(code=code, defaults={"name": name})

        enterprise, _ = Enterprise.objects.get_or_create(
            owner=user,
            name="Ferme Démo",
        )

        Membership.objects.get_or_create(user=user, enterprise=enterprise, defaults={"role": "owner"})

        farm, _ = Farm.objects.get_or_create(
            enterprise=enterprise,
            name="Ferme Principale",
            defaults={"location": "Dakar"},
        )

        poultry = Species.objects.get(code="poultry")

        unit, _ = Unit.objects.get_or_create(
            farm=farm,
            species=poultry,
            name="Poulailler A",
            defaults={"capacity": 1000, "conditions": {"type": "chair"}},
        )

        lot, _ = Lot.objects.get_or_create(
            unit=unit,
            species=poultry,
            code="LOT-001",
            defaults={
                "entry_date": date.today() - timedelta(days=14),
                "initial_count": 500,
                "status": "active",
                "destination": "production",
            },
        )

        LotDailyRecord.objects.get_or_create(
            lot=lot,
            date=date.today() - timedelta(days=1),
            defaults={
                "mortality": 2,
                "feed_intake_kg": 120,
                "eggs_count": 0,
                "avg_weight_kg": 1.2,
            },
        )

        HealthEvent.objects.get_or_create(
            lot=lot,
            date=date.today() - timedelta(days=3),
            event_type="vaccination",
            defaults={"product": "Gumboro", "dose": "1ml", "veterinarian": "Dr. Demo"},
        )

        StockItem.objects.get_or_create(
            farm=farm,
            name="Maïs",
            defaults={
                "item_type": "feed",
                "quantity": 800,
                "unit": "kg",
                "alert_threshold": 200,
            },
        )

        self.stdout.write(self.style.SUCCESS("Seed demo terminé."))
