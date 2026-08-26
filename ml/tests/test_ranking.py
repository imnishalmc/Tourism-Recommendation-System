import pandas as pd

from ml.config import DATASET_PATH

from ml.preprocessing.cleaning import DataPreprocessor
from ml.preprocessing.text_preprocessing import TextPreprocessor
from ml.preprocessing.feature_engineering import FeatureEngineer

from ml.search.search_engine import SearchEngine
from ml.search.filters import SearchFilter
from ml.search.ranking import SearchRanking


df = pd.read_csv(DATASET_PATH)

clean_df = DataPreprocessor(df).preprocess()

processor = TextPreprocessor(clean_df)

columns = [
    "description",
    "tags",
    "activities",
    "main_category",
    "district",
    "best_season",
    "transportation",
    "accessibility",
    "difficulty_level"
]

processed_df = processor.preprocess_columns(columns)

feature_df = FeatureEngineer(processed_df).preprocess()

search_engine = SearchEngine(feature_df)

query = input("Enter search query: ")

results = search_engine.search(query)

print("\nAvailable Categories:\n")

for category in sorted(results["main_category"].unique()):
    print(category)

print()

category = input("Enter category (leave blank for all): ")

if category.strip():

    results = SearchFilter().filter_by_category(
        results,
        [category]
    )

ranked = SearchRanking().rank(results)

print()

if ranked.empty:
    print("No destinations found.")

else:

    print(f"Found {len(ranked)} destination(s)\n")

    print(
        ranked[
            [
                "destination",
                "main_category",
                "district",
                "ratings",
                "popularity"
            ]
        ]
    )