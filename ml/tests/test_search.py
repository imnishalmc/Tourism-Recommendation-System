import pandas as pd

from config import DATASET_PATH

from preprocessing.cleaning import DataPreprocessor
from preprocessing.text_preprocessing import TextPreprocessor
from preprocessing.feature_engineering import FeatureEngineer

from search.search_engine import SearchEngine


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

print()

if results.empty:
    print("No destinations found.")

else:
    print(f"Found {len(results)} destination(s)\n")

    for _, row in results.iterrows():
        print("=" * 80)
        print("Destination :", row["destination"])
        print("Category    :", row["main_category"])
        print("District    :", row["district"])
        print("Rating      :", row["ratings"])
        print("Popularity  :", row["popularity"])