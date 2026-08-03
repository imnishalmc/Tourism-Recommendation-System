import pandas as pd

from config import DATASET_PATH

from preprocessing.cleaning import DataPreprocessor
from preprocessing.text_preprocessing import TextPreprocessor
from preprocessing.feature_engineering import FeatureEngineer

from features.text_features import TextFeatureExtractor
from features.category_features import CategoryFeatureExtractor
from features.numeric_features import NumericFeatureExtractor
from features.difficulty_features import DifficultyFeatureExtractor
from features.feature_combiner import FeatureCombiner

from similarity.cosine_similarity import CosineSimilarityCalculator


df = pd.read_csv(DATASET_PATH)

clean_df = DataPreprocessor(df).preprocess()

processor = TextPreprocessor(clean_df)

columns = [
    "description",
    "tags",
    "activities",
    "main_category",
    "district",
    "best_season",
    "transportation",
    "accessibility",
    "difficulty_level"
]

processed_df = processor.preprocess_columns(columns)

feature_df = FeatureEngineer(processed_df).preprocess()

text_matrix = TextFeatureExtractor().extract_features(feature_df)

category_matrix = CategoryFeatureExtractor().extract_features(feature_df)

numeric_matrix = NumericFeatureExtractor().extract_features(feature_df)

difficulty_matrix = DifficultyFeatureExtractor().extract_features(feature_df)

combined_matrix = FeatureCombiner().combine(
    text_matrix,
    category_matrix,
    numeric_matrix,
    difficulty_matrix
)

similarity_matrix = CosineSimilarityCalculator().calculate(combined_matrix)

print("Similarity Matrix Shape:")
print(similarity_matrix.shape)

print()

print("Similarity of first destination with itself:")
print(similarity_matrix[0][0])

print()

print("First 10 similarity scores:")
print(similarity_matrix[0][:10])