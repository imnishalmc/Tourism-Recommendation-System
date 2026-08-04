from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATASET_PATH = PROJECT_ROOT / "data" / "Sajilo_Yatraa_dataset.csv"
CLEANED_DATASET_PATH = PROJECT_ROOT / "data" / "cleaned_dataset.csv"

TOP_K = 6
MIN_SIMILARITY = 0.10

TEXT_WEIGHT = 0.50
CATEGORY_WEIGHT = 0.20
NUMERIC_WEIGHT = 0.25
DIFFICULTY_WEIGHT = 0.05

MAX_FEATURES = 500
NGRAM_RANGE = (1, 2)
STOP_WORDS = "english"

NUMERIC_COLUMNS = [
    "ratings",
    "popularity",
    "attraction_total_reviews",
]

TEXT_COLUMNS = [
    "description",
    "tags",
    "activities",
]

CATEGORY_COLUMN = "main_category"

DIFFICULTY_COLUMN = "difficulty_level"

SEARCH_COLUMNS = [
    "destination",
    "description",
    "tags",
    "activities",
]