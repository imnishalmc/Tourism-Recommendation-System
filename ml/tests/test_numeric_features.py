import pandas as pd

from ml.features.numeric_features import (
    NumericFeatureExtractor,
)


def test_extract_numeric_features():

    df = pd.DataFrame(
        {
            "ratings": [4.5, 5.0],
            "popularity": [100, 200],
            "attraction_total_reviews": [50, 75],
        }
    )

    extractor = NumericFeatureExtractor()

    matrix = extractor.extract_features(df)

    assert matrix.shape == (2, 3)


def test_numeric_feature_names():

    extractor = NumericFeatureExtractor()

    names = extractor.get_feature_names()

    assert names == [
        "ratings",
        "popularity",
        "attraction_total_reviews",
    ]