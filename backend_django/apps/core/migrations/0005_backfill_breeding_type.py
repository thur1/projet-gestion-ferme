from django.db import migrations

def forwards(apps, schema_editor):
    Species = apps.get_model('core', 'Species')
    BreedingType = apps.get_model('core', 'BreedingType')
    Unit = apps.get_model('core', 'Unit')

    code_to_bt = {}
    for sp in Species.objects.all():
        bt, _ = BreedingType.objects.get_or_create(code=sp.code, defaults={'name': sp.name})
        code_to_bt[sp.id] = bt
        sp.breeding_type = bt
        sp.save(update_fields=['breeding_type'])

    for unit in Unit.objects.all():
        if unit.species_id:
            bt = code_to_bt.get(unit.species_id)
            if not bt:
                bt, _ = BreedingType.objects.get_or_create(code='DEFAULT', defaults={'name': 'Type par défaut'})
            unit.breeding_type = bt
            unit.save(update_fields=['breeding_type'])

def backwards(apps, schema_editor):
    # No-op: keeping breeding types
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_breeding_type'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
