from django.db import models
from django.conf import settings

from apps.common.models import UUIDModel, TimeStampedModel, SoftDeleteModel, SoftDeleteManager


class Enterprise(UUIDModel, TimeStampedModel, SoftDeleteModel):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='owned_enterprises', on_delete=models.CASCADE)

    objects = SoftDeleteManager()

    def __str__(self):
        return self.name


class Farm(UUIDModel, TimeStampedModel, SoftDeleteModel):
    enterprise = models.ForeignKey(Enterprise, related_name='farms', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)

    objects = SoftDeleteManager()

    def __str__(self):
        return self.name


class Membership(UUIDModel, TimeStampedModel, SoftDeleteModel):
    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('user', 'User'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='memberships', on_delete=models.CASCADE)
    enterprise = models.ForeignKey(Enterprise, related_name='memberships', on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    class Meta:
        unique_together = ('user', 'enterprise')

    objects = SoftDeleteManager()

    def __str__(self):
        return f"{self.user} ({self.role})"


class Species(UUIDModel, TimeStampedModel):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Unit(UUIDModel, TimeStampedModel, SoftDeleteModel):
    farm = models.ForeignKey(Farm, related_name='units', on_delete=models.CASCADE)
    species = models.ForeignKey(Species, related_name='units', on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField()
    conditions = models.JSONField(default=dict, blank=True)

    objects = SoftDeleteManager()

    def __str__(self):
        return self.name


class Lot(UUIDModel, TimeStampedModel, SoftDeleteModel):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('closed', 'Closed'),
    )

    unit = models.ForeignKey(Unit, related_name='lots', on_delete=models.CASCADE)
    species = models.ForeignKey(Species, related_name='lots', on_delete=models.PROTECT)
    code = models.CharField(max_length=100)
    entry_date = models.DateField()
    initial_count = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    destination = models.CharField(max_length=100, blank=True)

    objects = SoftDeleteManager()

    class Meta:
        unique_together = ('unit', 'code')

    def __str__(self):
        return self.code


class LotDailyRecord(UUIDModel, TimeStampedModel, SoftDeleteModel):
    lot = models.ForeignKey(Lot, related_name='daily_records', on_delete=models.CASCADE)
    date = models.DateField()
    mortality = models.PositiveIntegerField(default=0)
    feed_intake_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    milk_production_l = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    eggs_count = models.PositiveIntegerField(default=0)
    avg_weight_kg = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    notes = models.TextField(blank=True)

    objects = SoftDeleteManager()

    class Meta:
        unique_together = ('lot', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.lot.code} {self.date}"


class HealthEvent(UUIDModel, TimeStampedModel, SoftDeleteModel):
    EVENT_TYPES = (
        ('vaccination', 'Vaccination'),
        ('treatment', 'Treatment'),
        ('disease', 'Disease'),
    )

    lot = models.ForeignKey(Lot, related_name='health_events', on_delete=models.CASCADE)
    date = models.DateField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    product = models.CharField(max_length=255, blank=True)
    dose = models.CharField(max_length=100, blank=True)
    veterinarian = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)

    objects = SoftDeleteManager()

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.event_type} {self.date}"


class StockItem(UUIDModel, TimeStampedModel, SoftDeleteModel):
    ITEM_TYPES = (
        ('feed', 'Feed'),
        ('med', 'Medicine'),
        ('other', 'Other'),
    )

    farm = models.ForeignKey(Farm, related_name='stock_items', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    item_type = models.CharField(max_length=10, choices=ITEM_TYPES)
    quantity = models.DecimalField(max_digits=12, decimal_places=3, default=0)
    unit = models.CharField(max_length=20, default='kg')
    alert_threshold = models.DecimalField(max_digits=12, decimal_places=3, default=0)

    objects = SoftDeleteManager()

    class Meta:
        unique_together = ('farm', 'name')

    def __str__(self):
        return self.name


class StockMovement(UUIDModel, TimeStampedModel, SoftDeleteModel):
    MOVEMENT_TYPES = (
        ('in', 'In'),
        ('out', 'Out'),
    )

    stock_item = models.ForeignKey(StockItem, related_name='movements', on_delete=models.CASCADE)
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_TYPES)
    quantity = models.DecimalField(max_digits=12, decimal_places=3)
    date = models.DateField()
    lot = models.ForeignKey(Lot, related_name='stock_movements', null=True, blank=True, on_delete=models.SET_NULL)
    reason = models.CharField(max_length=255, blank=True)

    objects = SoftDeleteManager()

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.movement_type} {self.quantity} {self.stock_item}"
