from django.db import migrations

SPECIES = [
    ('poultry_broiler', 'Volaille chair'),
    ('poultry_layer', 'Pondeuse'),
    ('cattle_dairy', 'Bovin lait'),
    ('cattle_beef', 'Bovin viande'),
]


def seed_species(apps, schema_editor):
    Species = apps.get_model('core', 'Species')
    for code, name in SPECIES:
        Species.objects.get_or_create(code=code, defaults={'name': name})


def unseed_species(apps, schema_editor):
    Species = apps.get_model('core', 'Species')
    Species.objects.filter(code__in=[code for code, _ in SPECIES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_species, reverse_code=unseed_species),
    ]
