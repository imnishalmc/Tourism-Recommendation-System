import pandas as pd

from django.core.management.base import BaseCommand

from destinations.models import Destination


CSV_PATH = "data/Sajilo_Yatraa_dataset.csv"


def first_image_path(value):
    """Return the first usable local image path from a CSV image list."""
    if pd.isna(value):
        return ""
    paths = [path.strip().replace("\\", "/") for path in str(value).split(";")]
    return next((path for path in paths if path), "")


class Command(BaseCommand):
    help = "Fill blank destination image fields from the imported dataset"

    def handle(self, *args, **options):
        dataframe = pd.read_csv(CSV_PATH)
        updated = 0
        missing = 0

        for _, row in dataframe.iterrows():
            image_path = first_image_path(row.get("destination_image_path"))
            if not image_path:
                continue

            destination = Destination.objects.filter(
                name=str(row["destination"]).strip().title(),
                image_url="",
            ).first()
            if destination is None:
                missing += 1
                continue

            destination.image_url = image_path
            destination.save(update_fields=["image_url"])
            updated += 1

        self.stdout.write(self.style.SUCCESS(
            f"Updated {updated} blank image fields. {missing} dataset rows were not matched."
        ))
