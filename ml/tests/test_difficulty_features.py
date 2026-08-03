import pandas as pd

from config import DATASET_PATH
from preprocessing.cleaning import DataPreprocessor
from preprocessing.text_preprocessing import TextPreprocessor
from preprocessing.feature_engineering import FeatureEngineer
from features.difficulty_features import DifficultyFeatureExtractor


df = pd.read_csv(DATASET_PATH)

clean_df = DataPreprocessor(df).preprocess()

processed_df = TextPreprocessor(clean_df).preprocess()

feature_df = FeatureEngineer(processed_df).preprocess()

extractor = DifficultyFeatureExtractor()

difficulty_matrix = extractor.extract_features(feature_df)

print("Difficulty Matrix Shape:")
print(difficulty_matrix.shape)

print("\nFeature Names:")
print(extractor.get_feature_names())

print("\nFirst 10 Rows:")
print(difficulty_matrix[:10])