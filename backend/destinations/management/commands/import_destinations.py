import re
import pandas as pd
from destinations.constants import PROVINCE_NAME_MAP
from django.core.management.base import BaseCommand
from destinations.models import Destination
from destinations.lookups import (
    DIFFICULTY_NORMALIZATION,
    MAIN_CATEGORY_NORMALIZATION,
    BUDGET_DURATION_LOOKUP,
)

CSV_PATH = "destinations/data/Sajilo_Yatraa_datasett.csv"


def clean_coordinate(value):
    """
    Convert coordinates like:
        27.7107° N
        83.9852° E


    into float values:
        27.7107
        83.9852
    """

    if pd.isna(value):
        return None

    cleaned = re.sub(r"[°NnSsEeWw\s]", "", str(value))
    return float(cleaned)


def split_tags(raw_tags):
    """
    Converts

    Nature, Photography
    Nature;Photography

    into

    ["Nature", "Photography"]
    """

    if pd.isna(raw_tags):
        return []

    normalized = str(raw_tags).replace(";", ",")

    return [tag.strip() for tag in normalized.split(",") if tag.strip()]


class Command(BaseCommand):
    help = "Import destination dataset into the database"

    def handle(self, *args, **options):

        self.stdout.write(self.style.NOTICE("Reading CSV..."))

        df = pd.read_csv(CSV_PATH)

        created_count = 0
        updated_count = 0
        skipped_rows = []

        for _, row in df.iterrows():
            try:
                # Normalize Category

                raw_category = str(row["main_category"]).strip()

                category_key = MAIN_CATEGORY_NORMALIZATION[raw_category]

                # Normalize Difficulty

                raw_difficulty = str(row["difficulty_level"]).strip()

                difficulty_key = DIFFICULTY_NORMALIZATION[raw_difficulty]

                # Estimate Budget & Duration

                budget_level, duration_days = BUDGET_DURATION_LOOKUP[
                    (category_key, difficulty_key)
                ]

                # Create or Update Destination

                destination, created = Destination.objects.update_or_create(
                    name=str(row["destination"]).strip().title(),
                    defaults={
                        "district": row["district"],
                        "province": PROVINCE_NAME_MAP.get(str(row['province']).strip(), str(row['province'])),,
                        "best_season": row["best_season"],
                        "main_category": category_key,
                        "tags": split_tags(row["tags"]),
                        "activities": row["activities"],
                        "difficulty_level": difficulty_key,
                        "accessibility": row["accessibility"],
                        "transportation": row["transportation"],
                        "crowd_level": (
                            str(row["crowd_level"]).strip().lower().replace(" ", "_")
                        ),
                        "budget_level": budget_level,
                        "visit_duration_days": duration_days,
                        "latitude": clean_coordinate(row["latitude"]),
                        "longitude": clean_coordinate(row["longitude"]),
                        "description": row["description"],
                        "ratings": row["ratings"],
                        "popularity": row["popularity"],
                        "attraction_total_reviews": row["attraction_total_reviews"],
                    },
                )

                if created:
                    created_count += 1
                else:
                    updated_count += 1

            except KeyError as e:
                skipped_rows.append(
                    (
                        row.get("destination", "Unknown"),
                        f"Lookup missing: {e}",
                    )
                )

            except Exception as e:
                skipped_rows.append(
                    (
                        row.get("destination", "Unknown"),
                        str(e),
                    )
                )

        # Summary

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("=" * 50))
        self.stdout.write(self.style.SUCCESS(f"Created : {created_count}"))
        self.stdout.write(self.style.SUCCESS(f"Updated : {updated_count}"))
        self.stdout.write(self.style.WARNING(f"Skipped : {len(skipped_rows)}"))
        self.stdout.write(self.style.SUCCESS("=" * 50))

        if skipped_rows:
            self.stdout.write("\nSkipped Rows:\n")

            for destination, reason in skipped_rows:
                self.stdout.write(f"• {destination} --> {reason}")
