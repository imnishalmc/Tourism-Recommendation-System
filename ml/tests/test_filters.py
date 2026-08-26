import pandas as pd

from ml.config import DATASET_PATH

from ml.preprocessing.cleaning import DataPreprocessor
from ml.preprocessing.text_preprocessing import TextPreprocessor
from ml.preprocessing.feature_engineering import FeatureEngineer

from ml.search.search_engine import SearchEngine
from ml.search.filters import SearchFilter


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

if results.empty:
    print("\nNo destinations found.")
    exit()

print("\nAvailable Categories:\n")

for category in sorted(results["main_category"].unique()):
    print(category)

print()

category = input("Enter category (leave blank for all): ")

filter_engine = SearchFilter()

filtered = filter_engine.filter_by_category(
    results,
    category
)

print()

if filtered.empty:
    print("No destinations found after filtering.")

else:
    print(f"Found {len(filtered)} destination(s)\n")

    print(
        filtered[
            [
                "destination",
                "main_category",
                "district",
                "ratings",
                "popularity"
            ]
        ].to_string(index=False)
    )