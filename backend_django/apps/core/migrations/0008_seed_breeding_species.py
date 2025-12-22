import uuid
from django.db import migrations


def forwards(apps, schema_editor):
    BreedingType = apps.get_model('core', 'BreedingType')
    Species = apps.get_model('core', 'Species')

    matrix = {
        ('CHICKEN', 'Poulet'): [
            ('POU-CHAIR', 'Poulet de chair'),
            ('POU-POND', 'Poulet pondeuse'),
            ('POU-REPRO', 'Poulet reproducteur'),
            ('POU-FERMIER', 'Poulet fermier'),
            ('POU-LABEL', 'Poulet label/biologique'),
            ('POU-LOCAL', 'Poulet local'),
            ('POU-INDUS', 'Poulet industriel'),
        ],
        ('BOV', 'Bovin'): [
            ('BOV-LAIT', 'Bovin laitier'),
            ('BOV-VIAN', 'Bovin à viande'),
            ('BOV-REPRO', 'Bovin reproducteur'),
            ('BOV-VEAU', 'Veau'),
            ('BOV-GENIS', 'Génisse'),
            ('BOV-TAUR', 'Taureau'),
        ],
        ('POR', 'Porcin'): [
            ('POR-CHAR', 'Porc charcutier'),
            ('POR-TRUIE', 'Truie reproductrice'),
            ('POR-VER', 'Verrat'),
            ('POR-PORC', 'Porcelet sevré'),
            ('POR-LAB', 'Porc label/plein air'),
        ],
        ('OVI', 'Ovin'): [
            ('OVI-LAIT', 'Brebis laitière'),
            ('OVI-VIAN', 'Brebis allaitante/viande'),
            ('OVI-BEL', 'Bélier'),
            ('OVI-AGN', 'Agneau'),
            ('OVI-AGNE', 'Agnelle de renouvellement'),
        ],
        ('CAP', 'Caprin'): [
            ('CAP-LAIT', 'Chèvre laitière'),
            ('CAP-BOUC', 'Bouc reproducteur'),
            ('CAP-CHEV', 'Chevreau engraissement'),
        ],
        ('DIN', 'Dinde'): [
            ('DIN-CHAIR', 'Dinde de chair'),
            ('DIN-REPRO', 'Dinde reproductrice'),
        ],
        ('CND', 'Canard'): [
            ('CND-CHAIR', 'Canard de chair'),
            ('CND-MUL', 'Canard mulard (foie gras)'),
            ('CND-POND', 'Canard ponte'),
        ],
        ('OIE', 'Oie'): [
            ('OIE-CHAIR', 'Oie de chair'),
            ('OIE-FOIE', 'Oie pour foie gras'),
            ('OIE-OISON', 'Oison'),
        ],
        ('CER', 'Cervidé'): [
            ('CER-CERF', 'Cerf'),
            ('CER-BICH', 'Biche'),
            ('CER-FAON', 'Faon'),
            ('CER-DAIM', 'Daim'),
        ],
        ('FISH', 'Piscicole'): [
            ('FISH-TILA', 'Tilapia'),
            ('FISH-SIL', 'Silure'),
            ('FISH-TRUI', 'Truite'),
            ('FISH-CARP', 'Carpe'),
            ('FISH-BAR', 'Bar'),
            ('FISH-SAUM', 'Saumon'),
        ],
        ('BEE', 'Apicole'): [
            ('BEE-MIEL', 'Ruche production miel'),
            ('BEE-REINE', 'Ruche reproduction/reines'),
            ('BEE-NUC', 'Nuclei'),
        ],
        ('EQU', 'Équin'): [
            ('EQU-SEL', 'Cheval de selle'),
            ('EQU-TRAIT', 'Cheval de trait'),
            ('EQU-POUL', 'Poulinière'),
            ('EQU-POULN', 'Poulain'),
        ],
        ('RAB', 'Cunicole'): [
            ('RAB-REPRO', 'Lapin reproducteur'),
            ('RAB-CHAIR', 'Lapin de chair'),
            ('RAB-LAP', 'Lapereau sevré'),
        ],
        ('PIGE', 'Pigeon'): [
            ('PIGE-CHAIR', 'Pigeon de chair'),
            ('PIGE-REPRO', 'Pigeon reproducteur'),
        ],
    }

    for (bt_code, bt_name), species_list in matrix.items():
        bt, _ = BreedingType.objects.get_or_create(code=bt_code, defaults={'name': bt_name, 'id': uuid.uuid4()})
        for code, name in species_list:
            Species.objects.get_or_create(
                code=code,
                defaults={'name': name, 'breeding_type': bt, 'id': uuid.uuid4()},
            )


def backwards(apps, schema_editor):
    Species = apps.get_model('core', 'Species')
    codes = [
        'POU-CHAIR', 'POU-POND', 'POU-REPRO', 'POU-FERMIER', 'POU-LABEL', 'POU-LOCAL', 'POU-INDUS',
        'BOV-LAIT', 'BOV-VIAN', 'BOV-REPRO', 'BOV-VEAU', 'BOV-GENIS', 'BOV-TAUR',
        'POR-CHAR', 'POR-TRUIE', 'POR-VER', 'POR-PORC', 'POR-LAB',
        'OVI-LAIT', 'OVI-VIAN', 'OVI-BEL', 'OVI-AGN', 'OVI-AGNE',
        'CAP-LAIT', 'CAP-BOUC', 'CAP-CHEV',
        'DIN-CHAIR', 'DIN-REPRO',
        'CND-CHAIR', 'CND-MUL', 'CND-POND',
        'OIE-CHAIR', 'OIE-FOIE', 'OIE-OISON',
        'CER-CERF', 'CER-BICH', 'CER-FAON', 'CER-DAIM',
        'FISH-TILA', 'FISH-SIL', 'FISH-TRUI', 'FISH-CARP', 'FISH-BAR', 'FISH-SAUM',
        'BEE-MIEL', 'BEE-REINE', 'BEE-NUC',
        'EQU-SEL', 'EQU-TRAIT', 'EQU-POUL', 'EQU-POULN',
        'RAB-REPRO', 'RAB-CHAIR', 'RAB-LAP',
        'PIGE-CHAIR', 'PIGE-REPRO',
    ]
    Species.objects.filter(code__in=codes).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_merge_financial_entry_and_breeding_type'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]