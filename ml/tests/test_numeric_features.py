import pandas as pd

from ml.config import DATASET_PATH
from ml.preprocessing.cleaning import DataPreprocessor
from ml.preprocessing.text_preprocessing import TextPreprocessor
from ml.preprocessing.feature_engineering import FeatureEngineer
from ml.features.numeric_features import NumericFeatureExtractor


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