import numpy as np

class DifficultyFeatureExtractor:

    def __init__(self):
        self.mapping = {
            "very easy": 0.0,
            "easy": 0.0,
            "easy-moderate": 0.33,
            "easy–moderate": 0.33,
            "moderate": 0.5,
            "medium": 0.5,
            "hard": 1.0,
            "challenging": 1.0,
            "high": 1.0,
            "very difficult": 1.0,
            "very_hard": 1.0,
        }

    def extract_features(self, dataframe):
        difficulty = (
            dataframe["difficulty_level"]
            .astype(str)
            .str.lower()
            .map(self.mapping)
            .fillna(0.5)
            .astype(float)
        )

        return difficulty.to_numpy().reshape(-1, 1)

    def get_feature_names(self):
        return ["difficulty_level"]