import pandas as pd

from config import DATASET_PATH
from preprocessing.cleaning import DataPreprocessor
from preprocessing.text_preprocessing import TextPreprocessor
from preprocessing.feature_engineering import FeatureEngineer
from features.numeric_features import NumericFeatureExtractor


df = pd.read_csv(DATASET_PATH)

clean_df = DataPreprocessor(df).preprocess()

processed_df = TextPreprocessor(clean_df).preprocess()

feature_df = FeatureEngineer(processed_df).preprocess()

extractor = NumericFeatureExtractor()

numeric_matrix = extractor.extract_features(feature_df)

print("Numeric Matrix Shape:")
print(numeric_matrix.shape)

print("\nFeature Names:")
print(extractor.get_feature_names())

print("\nFirst 5 Rows:")
print(numeric_matrix[:5])