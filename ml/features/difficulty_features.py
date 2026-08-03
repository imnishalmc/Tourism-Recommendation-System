import numpy as np


class DifficultyFeatureExtractor:

    def __init__(self):

        self.mapping = {
            "Easy": 0,
            "Moderate": 1,
            "Hard": 2
        }

    def extract_features(self, dataframe):

        difficulty = (
            dataframe["difficulty_level"]
            .map(self.mapping)
            .fillna(1)
            .astype(float)
            / 2
        )

        return difficulty.to_numpy().reshape(-1, 1)

    def get_feature_names(self):
        return ["difficulty_level"]