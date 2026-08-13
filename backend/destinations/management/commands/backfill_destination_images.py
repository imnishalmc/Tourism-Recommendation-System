import pandas as pd

from django.core.management.base import BaseCommand

from destinations.models import Destination


CSV_PATH = "data/Sajilo_Yatraa_dataset.csv"


def dataset_image_paths(value):
    """
    Keep every valid image path from the dataset in one semicolon-separated
    string. The frontend will try the next path if an earlier image fails.
    """
    if pd.isna(value):
        return ""

    paths = [
        path.strip().replace("\\", "/")
        for path in str(value).split(";")
        if path.strip()
    ]

    return ";".join(paths)


class Command(BaseCommand):
    help = "Save all dataset image paths for every imported destination"

    def handle(self, *args, **options):
        dataframe = pd.read_csv(CSV_PATH)

        updated = 0
        missing = 0

        for _, row in dataframe.iterrows():
            image_paths = dataset_image_paths(
                row.get("destination_image_path")
            )

            if not image_paths:
                continue

            destination = Destination.objects.filter(
                name=str(row["destination"]).strip().title()
            ).first()

            if destination is None:
                missing += 1
                continue

            destination.image_url = image_paths
            destination.save(update_fields=["image_url"])
            updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Updated {updated} destinations. "
                f"{missing} dataset rows were not matched."
            )
        )