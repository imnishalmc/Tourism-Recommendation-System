import pandas as pd

from ml.features.text_features import (
    TextFeatureExtractor,
)


def test_extract_text_features():

    df = pd.DataFrame(
        {
            "combined_features": [
                "beautiful lake boating",
                "mountain trekking hiking",
            ]
        }
    )

    extractor = TextFeatureExtractor()

    matrix = extractor.extract_features(
        df
    )

    assert matrix.shape[0] == 2
    assert matrix.shape[1] > 0


def test_feature_names():

    df = pd.DataFrame(
        {
            "combined_features": [
                "beautiful lake",
                "mountain trekking",
            ]
        }
    )

    extractor = TextFeatureExtractor()

    extractor.extract_features(df)

    names = extractor.get_feature_names()

    assert len(names) > 0