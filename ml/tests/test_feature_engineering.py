import pandas as pd

from ml.config import DATASET_PATH
from ml.preprocessing.cleaning import DataPreprocessor
from ml.preprocessing.text_preprocessing import TextPreprocessor
from ml.preprocessing.feature_engineering import FeatureEngineer


df = pd.read_csv(DATASET_PATH)

clean_df = DataPreprocessor(df).preprocess()

processed_df = TextPreprocessor(clean_df).preprocess()

final_df = FeatureEngineer(processed_df).preprocess()

print(final_df[["destination", "combined_features"]].head())