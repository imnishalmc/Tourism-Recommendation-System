import pandas as pd

from ml.config import DATASET_PATH

from ml.preprocessing.cleaning import DataPreprocessor
from ml.preprocessing.text_preprocessing import TextPreprocessor
from ml.preprocessing.feature_engineering import FeatureEngineer

from ml.features.text_features import TextFeatureExtractor
from ml.features.category_features import CategoryFeatureExtractor
from ml.features.numeric_features import NumericFeatureExtractor
from ml.features.difficulty_features import DifficultyFeatureExtractor
from ml.features.feature_combiner import FeatureCombiner

from ml.similarity.cosine_similarity import CosineSimilarityCalculator

from ml.recommendation.recommendation_engine import RecommendationEngine


df = pd.read_csv(DATASET_PATH)

clean_df = DataPreprocessor(df).preprocess()

processor = TextPreprocessor(clean_df)

columns = [
    "description",
    "tags",
    "activities",
    "transportation"
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

similarity_matrix = CosineSimilarityCalculator().calculate(
    combined_matrix
)

engine = RecommendationEngine(
    feature_df,
    similarity_matrix
)

destination = input("Enter destination: ")

recommendations = engine.recommend(destination)

print()

if recommendations is None:
    print("Destination not found.")

else:

    print(f"Top {len(recommendations)} Recommendations\n")

    for i, place in enumerate(recommendations, start=1):

        print(f"{i}. {place['destination']}")
        print(f"   Category    : {place['main_category']}")
        print(f"   District    : {place['district']}")
        print(f"   Rating      : {place['ratings']}")
        print(f"   Popularity  : {place['popularity']}")
        print(f"   Match Score : {place['match_score']}%")
        print()