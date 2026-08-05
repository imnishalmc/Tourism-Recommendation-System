import pandas as pd

from ml.features.difficulty_features import (
    DifficultyFeatureExtractor,
)


def test_extract_difficulty_features():

    df = pd.DataFrame(
        {
            "difficulty_level": [
                "Easy",
                "Moderate",
                "Hard",
            ]
        }
    )

    extractor = DifficultyFeatureExtractor()

    matrix = extractor.extract_features(df)

    assert matrix.shape == (3, 1)


def test_unknown_difficulty():

    df = pd.DataFrame(
        {
            "difficulty_level": [
                "Unknown"
            ]
        }
    )

    extractor = DifficultyFeatureExtractor()

    matrix = extractor.extract_features(df)

    assert matrix[0][0] == 0.5