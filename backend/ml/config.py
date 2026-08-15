TOP_K = 6

MIN_SIMILARITY = 0.10



MAX_FEATURES = 500
NGRAM_RANGE = (1, 2) #choose one or two words combination feature 

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