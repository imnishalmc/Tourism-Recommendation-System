import pandas as pd

from scipy.sparse import csr_matrix

from ml.features.text_features import (
    TextFeatureExtractor,
)
from ml.features.category_features import (
    CategoryFeatureExtractor,
)
from ml.features.numeric_features import (
    NumericFeatureExtractor,
)
from ml.features.difficulty_features import (
    DifficultyFeatureExtractor,
)
from ml.features.feature_combiner import (
    FeatureCombiner,
)


def test_feature_combiner():

    df = pd.DataFrame(
        {
            "combined_features": [
                "beautiful lake",
                "mountain trekking",
            ],
            "main_category": [
                "Nature",
                "Adventure",
            ],
            "ratings": [
                4.5,
                5.0,
            ],
            "popularity": [
                100,
                200,
            ],
            "attraction_total_reviews": [
                50,
                80,
            ],
            "difficulty_level": [
                "Easy",
                "Hard",
            ],
        }
    )

    text_matrix = TextFeatureExtractor().extract_features(
        df
    )

    category_matrix = CategoryFeatureExtractor().extract_features(
        df
    )

    numeric_matrix = NumericFeatureExtractor().extract_features(
        df
    )

    difficulty_matrix = DifficultyFeatureExtractor().extract_features(
        df
    )

    combined = FeatureCombiner().combine(
        text_matrix,
        category_matrix,
        numeric_matrix,
        difficulty_matrix,
    )

    assert isinstance(
        combined,
        csr_matrix,
    )

    assert combined.shape[0] == 2
    assert combined.shape[1] > 0