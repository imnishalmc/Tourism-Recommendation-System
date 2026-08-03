import pandas as pd

from config import DATASET_PATH
from preprocessing.cleaning import DataPreprocessor
from preprocessing.text_preprocessing import TextPreprocessor
from preprocessing.feature_engineering import FeatureEngineer
from features.text_features import TextFeatureExtractor


df = pd.read_csv(DATASET_PATH)

clean_df = DataPreprocessor(df).preprocess()

processed_df = TextPreprocessor(clean_df).preprocess()

feature_df = FeatureEngineer(processed_df).preprocess()

extractor = TextFeatureExtractor()

tfidf_matrix = extractor.extract_features(feature_df)

print("TF-IDF Matrix Shape:")
print(tfidf_matrix.shape)

print("\nFirst 20 Features:")
print(extractor.get_feature_names()[:20])