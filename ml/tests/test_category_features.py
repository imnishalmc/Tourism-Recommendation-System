import pandas as pd

from ml.features.category_features import (
    CategoryFeatureExtractor,
)


def test_extract_category_features():

    df = pd.DataFrame(
        {
            "main_category": [
                "Nature",
                "Adventure",
                "Nature",
            ]
        }
    )

    extractor = CategoryFeatureExtractor()

    matrix = extractor.extract_features(df)

    assert matrix.shape[0] == 3
    assert matrix.shape[1] == 2


def test_category_feature_names():

    df = pd.DataFrame(
        {
            "main_category": [
                "Nature",
                "Adventure",
            ]
        }
    )

    extractor = CategoryFeatureExtractor()

    extractor.extract_features(df)

    names = extractor.get_feature_names()

    assert len(names) == 2