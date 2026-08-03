import pandas as pd

from config import DATASET_PATH

from preprocessing.cleaning import DataPreprocessor
from preprocessing.text_preprocessing import TextPreprocessor
from preprocessing.feature_engineering import FeatureEngineer

from search.search_engine import SearchEngine
from search.filters import SearchFilter
from search.ranking import SearchRanking


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