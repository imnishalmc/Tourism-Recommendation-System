import pandas as pd

from config import DATASET_PATH
from preprocessing.cleaning import DataPreprocessor
from preprocessing.text_preprocessing import TextPreprocessor
from preprocessing.feature_engineering import FeatureEngineer
from features.category_features import CategoryFeatureExtractor


df = pd.read_csv(DATASET_PATH)

clean_df = DataPreprocessor(df).preprocess()

processed_df = TextPreprocessor(clean_df).preprocess()

feature_df = FeatureEngineer(processed_df).preprocess()

extractor = CategoryFeatureExtractor()

category_matrix = extractor.extract_features(feature_df)

print("Category Matrix Shape:")
print(category_matrix.shape)

print("\nCategories:")
print(extractor.get_feature_names())