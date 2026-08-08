from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("destinations", "0002_destination_is_featured")]

    operations = [
        migrations.AlterField(
            model_name="destination",
            name="image_url",
            field=models.TextField(blank=True),
        ),
    ]
