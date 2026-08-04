import pandas as pd

from ml.config import DATASET_PATH
from ml.preprocessing.cleaning import DataPreprocessor
from ml.preprocessing.text_preprocessing import TextPreprocessor


df = pd.read_csv(DATASET_PATH)

cleaner = DataPreprocessor(df)
clean_df = cleaner.preprocess()

processor = TextPreprocessor(clean_df)
processed_df = processor.preprocess()

print("Before:\n")
print(clean_df["description"].head())

print("\nAfter:\n")
print(processed_df["description"].head())