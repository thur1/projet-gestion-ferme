from rest_framework import serializers

from .models import (
    Enterprise,
    Farm,
    BreedingType,
    Species,
    Unit,
    Lot,
    LotDailyRecord,
    HealthEvent,
    ReproductionEvent,
    FinancialEntry,
    StockItem,
    StockMovement,
)


class EnterpriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enterprise
        fields = ['id', 'name', 'owner', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        enterprise = super().create(validated_data)
        from .models import Membership
        Membership.objects.get_or_create(user=enterprise.owner, enterprise=enterprise, defaults={'role': 'owner'})
        return enterprise


class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = ['id', 'enterprise', 'name', 'location', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BreedingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BreedingType
        fields = ['id', 'code', 'name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'code', 'name', 'breeding_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'farm', 'breeding_type', 'species', 'name', 'capacity', 'conditions', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class LotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lot
        fields = [
            'id', 'unit', 'species', 'code', 'entry_date', 'initial_count', 'status', 'destination',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        unit = attrs.get('unit') or getattr(self.instance, 'unit', None)
        species = attrs.get('species') or getattr(self.instance, 'species', None)
        if unit and species:
            if unit.breeding_type_id and species.breeding_type_id and unit.breeding_type_id != species.breeding_type_id:
                raise serializers.ValidationError("L'espèce du lot doit appartenir au type d'élevage de l'unité.")
        return attrs


class LotDailyRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = LotDailyRecord
        fields = [
            'id', 'lot', 'date', 'mortality', 'feed_intake_kg', 'milk_production_l', 'eggs_count', 'avg_weight_kg',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HealthEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthEvent
        fields = ['id', 'lot', 'date', 'event_type', 'product', 'dose', 'veterinarian', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ReproductionEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReproductionEvent
        fields = [
            'id', 'lot', 'date', 'event_type', 'gestation_days', 'born_alive', 'born_dead', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FinancialEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialEntry
        fields = ['id', 'farm', 'lot', 'date', 'entry_type', 'category', 'amount', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StockItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockItem
        fields = ['id', 'farm', 'name', 'item_type', 'quantity', 'unit', 'alert_threshold', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = ['id', 'stock_item', 'movement_type', 'quantity', 'date', 'lot', 'reason', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        movement = super().create(validated_data)
        stock = movement.stock_item
        if movement.movement_type == 'in':
            stock.quantity += movement.quantity
        else:
            stock.quantity -= movement.quantity
        stock.save(update_fields=['quantity'])
        return movement
