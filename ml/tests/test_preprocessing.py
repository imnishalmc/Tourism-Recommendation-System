import pandas as pd

from ml.config import DATASET_PATH, CLEANED_DATASET_PATH
from ml.preprocessing.cleaning import DataPreprocessor


df = pd.read_csv(DATASET_PATH)

preprocessor = DataPreprocessor(df)

cleaned_df = preprocessor.preprocess()

preprocessor.save_dataset(CLEANED_DATASET_PATH)

print("Dataset cleaned successfully.\n")

print("Shape:", cleaned_df.shape)

print("\nFirst 5 rows:")
print(cleaned_df.head())

print("\nDataset Information:")
cleaned_df.info()

print("\nMissing Values:")
print(cleaned_df.isnull().sum())