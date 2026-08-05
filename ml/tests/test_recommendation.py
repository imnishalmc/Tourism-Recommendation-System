import pandas as pd
import numpy as np

from ml.recommendation.recommendation_engine import RecommendationEngine


def get_dataframe():

    return pd.DataFrame(
        {
            "destination": [
                "Pokhara",
                "Begnas Lake",
                "Chitwan",
            ],
            "district": [
                "Kaski",
                "Kaski",
                "Chitwan",
            ],
            "province": [
                "Gandaki",
                "Gandaki",
                "Bagmati",
            ],
            "main_category": [
                "Nature",
                "Nature",
                "Wildlife",
            ],
            "ratings": [
                4.9,
                4.6,
                4.7,
            ],
            "popularity": [
                100,
                80,
                90,
            ],
            "combined_features": [
                "lake boating nature",
                "lake nature",
                "jungle safari",
            ],
        }
    )


def test_recommendation():

    similarity = np.array(
        [
            [1.0, 0.90, 0.20],
            [0.90, 1.0, 0.10],
            [0.20, 0.10, 1.0],
        ]
    )

    engine = RecommendationEngine(
        get_dataframe(),
        similarity,
    )

    results = engine.recommend("Pokhara")

    print("\nRecommendation Output:")
    print(results)

    assert results is not None
    assert results["matched_destination"]["destination"] == "Pokhara"
    assert len(results["recommendations"]) >= 1