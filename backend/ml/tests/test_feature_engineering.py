import pandas as pd

from ml.preprocessing.feature_engineering import FeatureEngineer


def test_combined_features():

    df = pd.DataFrame(
        {
            "description": ["Beautiful Lake"],
            "tags": ["Nature"],
            "activities": ["Boating"],
            "main_category": ["Nature"],
            "district": ["Kaski"],
            "province": ["Gandaki"],
            "best_season": ["Autumn"],
            "transportation": ["Bus"],
            "accessibility": ["Easy"],
            "difficulty_level": ["Easy"],
        }
    )

    engineered = FeatureEngineer(
        df
    ).preprocess()

    assert "combined_features" in engineered.columns

    text = engineered.loc[
        0,
        "combined_features",
    ]

    assert "Beautiful Lake" in text
    assert "Nature" in text
    assert "Boating" in text