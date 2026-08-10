import pandas as pd

from destinations.models import Destination

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


class RecommendationService:

    def __init__(self):
        self.df = pd.DataFrame()
        self.similarity_matrix = None
        self.recommendation_engine = None

        self.load_model()

    def load_model(self):

        print("Loading Recommendation Model...")

        destinations = Destination.objects.all()

        if not destinations.exists():
            print("No destinations found.")

            self.df = pd.DataFrame()
            self.similarity_matrix = None
            self.recommendation_engine = None

            return

        data = []

        for destination in destinations:
            data.append(
                {
                    # Keep the database ID so the frontend can
                    # navigate to the destination detail page.
                    "id": destination.id,

                    "destination": destination.name,
                    "district": destination.district,
                    "province": destination.province,
                    "best_season": destination.best_season,
                    "main_category": destination.main_category,
                    "description": destination.description,
                    "tags": ", ".join(destination.tags)
                    if destination.tags
                    else "",
                    "activities": destination.activities,
                    "accessibility": destination.accessibility,
                    "transportation": destination.transportation,
                    "difficulty_level": destination.difficulty_level,
                    "crowd_level": destination.crowd_level,
                    "budget_level": destination.budget_level,
                    "visit_duration_days": destination.visit_duration_days,

                    # Keep image information available for the
                    # recommendation response.
                    "image_url": destination.image_url,

                    "latitude": destination.latitude,
                    "longitude": destination.longitude,

                    "ratings": destination.ratings,
                    "popularity": destination.popularity,
                    "attraction_total_reviews": (
                        destination.attraction_total_reviews
                    ),
                }
            )

        df = pd.DataFrame(data)

        clean_df = DataPreprocessor(df).preprocess()

        processed_df = TextPreprocessor(clean_df).preprocess()

        feature_df = FeatureEngineer(processed_df).preprocess()

        text_matrix = TextFeatureExtractor().extract_features(
            feature_df
        )

        category_matrix = CategoryFeatureExtractor().extract_features(
            feature_df
        )

        numeric_matrix = NumericFeatureExtractor().extract_features(
            feature_df
        )

        difficulty_matrix = DifficultyFeatureExtractor().extract_features(
            feature_df
        )

        combined_matrix = FeatureCombiner().combine(
            text_matrix,
            category_matrix,
            numeric_matrix,
            difficulty_matrix,
        )

        similarity_matrix = CosineSimilarityCalculator().calculate(
            combined_matrix
        )

        self.df = feature_df
        self.similarity_matrix = similarity_matrix

        self.recommendation_engine = RecommendationEngine(
            feature_df,
            similarity_matrix,
        )

        print(
            f"Recommendation Model Loaded Successfully "
            f"({len(feature_df)} destinations)."
        )

    def get_recommendations(
        self,
        destination,
        category=None,
    ):

        if self.recommendation_engine is None:
            return None

        if hasattr(destination, "name"):
            destination_name = destination.name
        else:
            destination_name = str(destination)

        return self.recommendation_engine.recommend(
            destination_name=destination_name,
            category=category,
        )