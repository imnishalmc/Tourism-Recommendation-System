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
    "transportation",
]

CATEGORY_COLUMN = "main_category"

DIFFICULTY_COLUMN = "difficulty_level"

SEARCH_COLUMNS = [
    "destination",
    "description",
    "tags",
    "activities",
    "district",
    "province",
    "main_category",
]