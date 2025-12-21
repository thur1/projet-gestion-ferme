from collections import defaultdict
from datetime import timedelta

from django.db.models import Sum, F, Q
from django.utils import timezone
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from .models import (
    Enterprise, Farm, Species, Unit, Lot, LotDailyRecord, HealthEvent, ReproductionEvent, FinancialEntry, StockItem, StockMovement, Membership
)
from .serializers import (
    EnterpriseSerializer, FarmSerializer, SpeciesSerializer, UnitSerializer, LotSerializer,
    LotDailyRecordSerializer, HealthEventSerializer, ReproductionEventSerializer, FinancialEntrySerializer, StockItemSerializer, StockMovementSerializer,
)
from .permissions import IsEnterpriseMember, get_enterprise_from_obj, user_role_in_enterprise


class BaseMemberViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsEnterpriseMember]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        # Scope to enterprises where user is member or owner
        member_ids = Membership.objects.filter(user=user, is_deleted=False).values_list('enterprise_id', flat=True)
        owner_ids = Enterprise.objects.filter(owner=user).values_list('id', flat=True)
        enterprise_ids = list(member_ids) + list(owner_ids)
        qs = qs.filter(self.scope_filter(enterprise_ids))
        return qs

    def scope_filter(self, enterprise_ids):
        return Q()

    def _ensure_write_role(self, enterprise):
        role = user_role_in_enterprise(self.request.user, enterprise)
        if role in ('owner', 'admin'):
            return
        raise PermissionDenied('Permission requise: owner ou admin')

    def perform_create(self, serializer):
        enterprise = self._enterprise_from_serializer(serializer.validated_data)
        if enterprise:
            self._ensure_write_role(enterprise)
        serializer.save()

    def perform_update(self, serializer):
        enterprise = self._enterprise_from_serializer(serializer.validated_data) or get_enterprise_from_obj(self.get_object())
        if enterprise:
            self._ensure_write_role(enterprise)
        serializer.save()

    def perform_destroy(self, instance):
        enterprise = get_enterprise_from_obj(instance)
        if enterprise:
            self._ensure_write_role(enterprise)
        instance.delete()

    def _enterprise_from_serializer(self, validated_data):
        if 'enterprise' in validated_data:
            return validated_data.get('enterprise')
        if 'farm' in validated_data:
            return validated_data.get('farm').enterprise
        if 'unit' in validated_data:
            return validated_data.get('unit').farm.enterprise
        if 'lot' in validated_data:
            return validated_data.get('lot').unit.farm.enterprise
        if 'stock_item' in validated_data:
            return validated_data.get('stock_item').farm.enterprise
        return None


class EnterpriseViewSet(BaseMemberViewSet):
    serializer_class = EnterpriseSerializer
    queryset = Enterprise.objects.filter(is_deleted=False)

    def get_queryset(self):
        # Allow owner-owned enterprises as well
        qs = Enterprise.objects.filter(is_deleted=False).filter(
            Q(owner=self.request.user) | Q(memberships__user=self.request.user, memberships__is_deleted=False)
        ).distinct()
        return qs


class FarmViewSet(BaseMemberViewSet):
    serializer_class = FarmSerializer
    queryset = Farm.objects.filter(is_deleted=False)

    def scope_filter(self, enterprise_ids):
        return Q(enterprise_id__in=enterprise_ids)

    def get_queryset(self):
        qs = super().get_queryset()
        enterprise_id = self.request.query_params.get('enterprise_id')
        if enterprise_id:
            qs = qs.filter(enterprise_id=enterprise_id)
        return qs.order_by('name')


class SpeciesViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = SpeciesSerializer
    queryset = Species.objects.all().order_by('code')
    permission_classes = [permissions.IsAuthenticated]


class UnitViewSet(BaseMemberViewSet):
    serializer_class = UnitSerializer
    queryset = Unit.objects.filter(is_deleted=False)

    def scope_filter(self, enterprise_ids):
        return Q(farm__enterprise_id__in=enterprise_ids)

    def get_queryset(self):
        qs = super().get_queryset()
        farm_id = self.request.query_params.get('farm_id')
        species = self.request.query_params.get('species')
        if farm_id:
            qs = qs.filter(farm_id=farm_id)
        if species:
            qs = qs.filter(species__code=species)
        return qs.order_by('name')


class LotViewSet(BaseMemberViewSet):
    serializer_class = LotSerializer
    queryset = Lot.objects.filter(is_deleted=False)

    def scope_filter(self, enterprise_ids):
        return Q(unit__farm__enterprise_id__in=enterprise_ids)

    def get_queryset(self):
        qs = super().get_queryset()
        unit_id = self.request.query_params.get('unit_id')
        farm_id = self.request.query_params.get('farm_id')
        species = self.request.query_params.get('species')
        status_param = self.request.query_params.get('status')
        if unit_id:
            qs = qs.filter(unit_id=unit_id)
        if farm_id:
            qs = qs.filter(unit__farm_id=farm_id)
        if species:
            qs = qs.filter(species__code=species)
        if status_param:
            qs = qs.filter(status=status_param)
        return qs.order_by('-created_at')


class LotDailyRecordViewSet(BaseMemberViewSet):
    serializer_class = LotDailyRecordSerializer
    queryset = LotDailyRecord.objects.filter(is_deleted=False)

    def scope_filter(self, enterprise_ids):
        return Q(lot__unit__farm__enterprise_id__in=enterprise_ids)

    def get_queryset(self):
        qs = super().get_queryset()
        lot_id = self.request.query_params.get('lot_id')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if lot_id:
            qs = qs.filter(lot_id=lot_id)
        if date_from:
            qs = qs.filter(date__gte=date_from)
        if date_to:
            qs = qs.filter(date__lte=date_to)
        return qs.order_by('-date')


class HealthEventViewSet(BaseMemberViewSet):
    serializer_class = HealthEventSerializer
    queryset = HealthEvent.objects.filter(is_deleted=False)

    def scope_filter(self, enterprise_ids):
        return Q(lot__unit__farm__enterprise_id__in=enterprise_ids)

    def get_queryset(self):
        qs = super().get_queryset()
        lot_id = self.request.query_params.get('lot_id')
        if lot_id:
            qs = qs.filter(lot_id=lot_id)
        return qs.order_by('-date')


class ReproductionEventViewSet(BaseMemberViewSet):
    serializer_class = ReproductionEventSerializer
    queryset = ReproductionEvent.objects.filter(is_deleted=False)

    def scope_filter(self, enterprise_ids):
        return Q(lot__unit__farm__enterprise_id__in=enterprise_ids)

    def get_queryset(self):
        qs = super().get_queryset()
        lot_id = self.request.query_params.get('lot_id')
        if lot_id:
            qs = qs.filter(lot_id=lot_id)
        return qs.order_by('-date', '-created_at')


class FinancialEntryViewSet(BaseMemberViewSet):
    serializer_class = FinancialEntrySerializer
    queryset = FinancialEntry.objects.filter(is_deleted=False)

    def scope_filter(self, enterprise_ids):
        return Q(farm__enterprise_id__in=enterprise_ids)

    def get_queryset(self):
        qs = super().get_queryset()
        farm_id = self.request.query_params.get('farm_id')
        lot_id = self.request.query_params.get('lot_id')
        if farm_id:
            qs = qs.filter(farm_id=farm_id)
        if lot_id:
            qs = qs.filter(lot_id=lot_id)
        return qs.order_by('-date', '-created_at')


class StockItemViewSet(BaseMemberViewSet):
    serializer_class = StockItemSerializer
    queryset = StockItem.objects.filter(is_deleted=False)

    def scope_filter(self, enterprise_ids):
        return Q(farm__enterprise_id__in=enterprise_ids)

    def get_queryset(self):
        qs = super().get_queryset()
        farm_id = self.request.query_params.get('farm_id')
        if farm_id:
            qs = qs.filter(farm_id=farm_id)
        return qs.order_by('name')


class StockMovementViewSet(BaseMemberViewSet):
    serializer_class = StockMovementSerializer
    queryset = StockMovement.objects.filter(is_deleted=False)

    def scope_filter(self, enterprise_ids):
        return Q(stock_item__farm__enterprise_id__in=enterprise_ids)

    def get_queryset(self):
        qs = super().get_queryset()
        stock_item_id = self.request.query_params.get('stock_item_id')
        farm_id = self.request.query_params.get('farm_id')
        if stock_item_id:
            qs = qs.filter(stock_item_id=stock_item_id)
        if farm_id:
            qs = qs.filter(stock_item__farm_id=farm_id)
        return qs.order_by('-date', '-created_at')


class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        farm_id = request.query_params.get('farm_id')
        if not farm_id:
            return Response({'detail': 'farm_id requis'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure user has access
        has_access = Farm.objects.filter(
            Q(enterprise__owner=request.user) |
            Q(enterprise__memberships__user=request.user, enterprise__memberships__is_deleted=False),
            id=farm_id,
            is_deleted=False,
        ).exists()
        if not has_access:
            return Response({'detail': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)

        now = timezone.now().date()
        last_7 = now - timedelta(days=7)
        last_30 = now - timedelta(days=30)

        lots_qs = Lot.objects.filter(unit__farm_id=farm_id, is_deleted=False)
        records_qs = LotDailyRecord.objects.filter(
            lot__unit__farm_id=farm_id, is_deleted=False, date__gte=last_7
        ).select_related('lot')
        stock_qs = StockItem.objects.filter(farm_id=farm_id, is_deleted=False)
        entries_qs = FinancialEntry.objects.filter(
            farm_id=farm_id, is_deleted=False, date__gte=last_30
        ).select_related('lot')

        total_lots = lots_qs.count()
        active_lots = lots_qs.filter(status='active').count()
        start_population = lots_qs.aggregate(total=Sum('initial_count'))['total'] or 0

        mortality = records_qs.aggregate(total=Sum('mortality'))['total'] or 0
        feed_intake = records_qs.aggregate(total=Sum('feed_intake_kg'))['total'] or 0
        milk = records_qs.aggregate(total=Sum('milk_production_l'))['total'] or 0
        eggs = records_qs.aggregate(total=Sum('eggs_count'))['total'] or 0

        mortality_rate_percent = round((mortality / start_population) * 100, 2) if start_population else 0.0
        hen_days = start_population * 7
        eggs_per_hen_per_day = round(eggs / hen_days, 3) if hen_days else 0.0

        records_by_lot = defaultdict(list)
        for rec in records_qs.order_by('lot_id', 'date'):
            records_by_lot[rec.lot_id].append(rec)

        total_weight_gain = 0.0
        avg_daily_gain_sum = 0.0
        gain_lot_count = 0
        for lot_records in records_by_lot.values():
            if len(lot_records) < 2:
                continue
            first = lot_records[0]
            last = lot_records[-1]
            days = max((last.date - first.date).days, 1)
            gain_per_animal = float(last.avg_weight_kg - first.avg_weight_kg)
            avg_daily_gain_sum += gain_per_animal / days
            gain_lot_count += 1
            headcount = first.lot.initial_count
            if gain_per_animal > 0 and headcount:
                total_weight_gain += gain_per_animal * headcount

        avg_daily_gain = round(avg_daily_gain_sum / gain_lot_count, 3) if gain_lot_count else 0.0
        feed_conversion_ratio = round(float(feed_intake) / total_weight_gain, 3) if total_weight_gain > 0 else None

        farm_margin_30d = 0.0
        lot_margin_map = defaultdict(lambda: {'lot_id': '', 'lot_code': '', 'margin': 0.0})
        for entry in entries_qs:
            signed_amount = float(entry.amount) if entry.entry_type == 'revenue' else -float(entry.amount)
            farm_margin_30d += signed_amount
            if entry.lot_id:
                lot_data = lot_margin_map[entry.lot_id]
                lot_data['lot_id'] = str(entry.lot_id)
                lot_data['lot_code'] = entry.lot.code if entry.lot else ''
                lot_data['margin'] += signed_amount
        lot_margins_30d = list(lot_margin_map.values())

        stock_alerts = list(
            stock_qs.filter(quantity__lt=F('alert_threshold')).values('id', 'name', 'quantity', 'unit', 'alert_threshold')
        )

        data = {
            'total_lots': total_lots,
            'active_lots': active_lots,
            'mortality_7d': mortality,
            'mortality_rate_percent_7d': mortality_rate_percent,
            'feed_intake_kg_7d': float(feed_intake),
            'milk_production_l_7d': float(milk),
            'eggs_count_7d': eggs,
            'eggs_per_hen_per_day': eggs_per_hen_per_day,
            'avg_daily_gain_kg': avg_daily_gain,
            'feed_conversion_ratio': feed_conversion_ratio,
            'farm_margin_30d': round(farm_margin_30d, 2),
            'lot_margins_30d': lot_margins_30d,
            'stock_alerts': stock_alerts,
        }
        return Response(data)
