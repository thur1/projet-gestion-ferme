from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_backfill_breeding_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='species',
            name='breeding_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='species', to='core.breedingtype'),
        ),
        migrations.AlterField(
            model_name='unit',
            name='breeding_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='units', to='core.breedingtype'),
        ),
    ]
