import pandas as pd

from ml.preprocessing.cleaning import DataPreprocessor
from ml.config import DATASET_PATH
from ml.preprocessing.text_preprocessing import TextPreprocessor
from ml.features.difficulty_features import DifficultyFeatureExtractor
from ml.preprocessing.feature_engineering import FeatureEngineer


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