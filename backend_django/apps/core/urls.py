from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import (
    EnterpriseViewSet, FarmViewSet, SpeciesViewSet, UnitViewSet, LotViewSet,
    LotDailyRecordViewSet, HealthEventViewSet, StockItemViewSet, StockMovementViewSet,
    DashboardSummaryView,
)

router = DefaultRouter()
router.register('enterprises', EnterpriseViewSet, basename='enterprise')
router.register('farms', FarmViewSet, basename='farm')
router.register('species', SpeciesViewSet, basename='species')
router.register('units', UnitViewSet, basename='unit')
router.register('lots', LotViewSet, basename='lot')
router.register('lot-records', LotDailyRecordViewSet, basename='lot-record')
router.register('health-events', HealthEventViewSet, basename='health-event')
router.register('stock-items', StockItemViewSet, basename='stock-item')
router.register('stock-movements', StockMovementViewSet, basename='stock-movement')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
]
