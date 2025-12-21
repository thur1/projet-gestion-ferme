from django.contrib import admin

from .models import (
    Enterprise,
    Farm,
    Membership,
    Species,
    Unit,
    Lot,
    LotDailyRecord,
    HealthEvent,
    StockItem,
    StockMovement,
)


@admin.register(Enterprise)
class EnterpriseAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "created_at", "deleted_at")
    search_fields = ("name", "owner__email")
    list_filter = ("deleted_at",)


@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ("name", "enterprise", "location", "created_at", "deleted_at")
    search_fields = ("name", "location", "enterprise__name")
    list_filter = ("deleted_at",)


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ("user", "enterprise", "role", "created_at", "deleted_at")
    list_filter = ("role", "deleted_at")
    search_fields = ("user__email", "enterprise__name")


@admin.register(Species)
class SpeciesAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "created_at")
    search_fields = ("code", "name")


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ("name", "farm", "species", "capacity", "created_at", "deleted_at")
    list_filter = ("species", "deleted_at")
    search_fields = ("name", "farm__name")


@admin.register(Lot)
class LotAdmin(admin.ModelAdmin):
    list_display = ("code", "unit", "species", "status", "entry_date", "created_at", "deleted_at")
    list_filter = ("status", "species", "deleted_at")
    search_fields = ("code", "unit__name")


@admin.register(LotDailyRecord)
class LotDailyRecordAdmin(admin.ModelAdmin):
    list_display = ("lot", "date", "mortality", "feed_intake_kg", "eggs_count", "avg_weight_kg", "created_at")
    list_filter = ("date", "lot")
    search_fields = ("lot__code",)


@admin.register(HealthEvent)
class HealthEventAdmin(admin.ModelAdmin):
    list_display = ("lot", "date", "event_type", "product", "veterinarian", "created_at")
    list_filter = ("event_type", "date")
    search_fields = ("lot__code", "product", "veterinarian")


@admin.register(StockItem)
class StockItemAdmin(admin.ModelAdmin):
    list_display = ("name", "farm", "item_type", "quantity", "unit", "alert_threshold", "deleted_at")
    list_filter = ("item_type", "deleted_at")
    search_fields = ("name", "farm__name")


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ("stock_item", "movement_type", "quantity", "date", "lot", "reason", "deleted_at")
    list_filter = ("movement_type", "date", "deleted_at")
    search_fields = ("stock_item__name", "lot__code", "reason")
