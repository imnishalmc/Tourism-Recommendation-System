import pandas as pd

from config import DATASET_PATH
from preprocessing.cleaning import DataPreprocessor
from preprocessing.text_preprocessing import TextPreprocessor


df = pd.read_csv(DATASET_PATH)

cleaner = DataPreprocessor(df)
clean_df = cleaner.preprocess()

processor = TextPreprocessor(clean_df)
processed_df = processor.preprocess()

print("Before:\n")
print(clean_df["description"].head())

print("\nAfter:\n")
print(processed_df["description"].head())