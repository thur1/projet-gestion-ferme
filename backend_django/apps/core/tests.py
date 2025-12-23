from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

from apps.core.models import Enterprise, Farm, Species, Unit, Lot, StockItem, Membership, HealthEvent, BreedingType

User = get_user_model()


class CoreApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='password123')
        self.client.force_authenticate(self.user)
        self.enterprise = Enterprise.objects.create(name='Ent', owner=self.user)
        Membership.objects.create(user=self.user, enterprise=self.enterprise, role='owner')
        self.farm = Farm.objects.create(name='Farm', enterprise=self.enterprise)
        self.breeding_type = BreedingType.objects.create(code='POU', name='Volaille')
        self.species, _ = Species.objects.get_or_create(
            code='poultry_broiler', defaults={'name': 'Volaille', 'breeding_type': self.breeding_type}
        )
        # Align seeded species with the breeding type used in tests to avoid validation mismatches
        if self.species.breeding_type_id != self.breeding_type.id:
            self.species.breeding_type = self.breeding_type
            self.species.save(update_fields=['breeding_type'])
        self.unit = Unit.objects.create(
            name='Unit', farm=self.farm, species=self.species, breeding_type=self.breeding_type, capacity=100
        )
        self.lot = Lot.objects.create(unit=self.unit, species=self.species, code='LOT1', entry_date='2025-01-01', initial_count=100)
        self.stock_item = StockItem.objects.create(farm=self.farm, name='Feed', item_type='feed', quantity=10, unit='kg', alert_threshold=5)

    def test_user_role_cannot_create_lot(self):
        member = User.objects.create_user(email='member@example.com', password='password123')
        Membership.objects.create(user=member, enterprise=self.enterprise, role='user')
        self.client.force_authenticate(member)
        url = reverse('lot-list')
        payload = {
            'unit': str(self.unit.id),
            'species': str(self.species.id),
            'code': 'LOT2',
            'entry_date': '2025-01-03',
            'initial_count': 50,
            'status': 'active'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_lot_daily_record(self):
        url = reverse('lot-record-list')
        payload = {
            'lot': str(self.lot.id),
            'date': '2025-01-02',
            'mortality': 2,
            'feed_intake_kg': '5.5',
            'milk_production_l': '0',
            'eggs_count': 0,
            'avg_weight_kg': '1.2'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_stock_movement_updates_quantity(self):
        url = reverse('stock-movement-list')
        payload = {
            'stock_item': str(self.stock_item.id),
            'movement_type': 'out',
            'quantity': '3',
            'date': '2025-01-02',
            'reason': 'test'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.stock_item.refresh_from_db()
        self.assertEqual(float(self.stock_item.quantity), 7.0)

    def test_dashboard_summary(self):
        url = reverse('dashboard-summary') + f'?farm_id={self.farm.id}'
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('total_lots', res.data)

    def test_create_health_event(self):
        url = reverse('health-event-list')
        payload = {
            'lot': str(self.lot.id),
            'date': '2025-01-05',
            'event_type': 'vaccination',
            'product': 'Vaccin X',
            'dose': '10ml',
            'veterinarian': 'Dr Vet',
            'notes': 'RAS'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(HealthEvent.objects.filter(id=res.data['id'], lot=self.lot).exists())

    def test_user_role_cannot_create_health_event(self):
        member = User.objects.create_user(email='member2@example.com', password='password123')
        Membership.objects.create(user=member, enterprise=self.enterprise, role='user')
        self.client.force_authenticate(member)

        url = reverse('health-event-list')
        payload = {
            'lot': str(self.lot.id),
            'date': '2025-01-05',
            'event_type': 'vaccination'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_health_event_rejects_invalid_choice(self):
        url = reverse('health-event-list')
        payload = {
            'lot': str(self.lot.id),
            'date': '2025-01-05',
            'event_type': 'unknown'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
