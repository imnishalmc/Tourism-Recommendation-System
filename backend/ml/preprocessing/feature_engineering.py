class FeatureEngineer:

    def __init__(self, dataframe):
        self.df = dataframe.copy()

    def create_combined_features(self):

        feature_columns = [
            "description",
            "tags",
            "activities",
            "main_category",
            "district",
            "province",
            "best_season",
            "transportation",
            "accessibility",
            "difficulty_level",
        ]

        self.df["combined_features"] = (
            self.df[feature_columns]
            .fillna("")
            .astype(str)
            .agg(" ".join, axis=1)
        )

        return self.df

    def preprocess(self):
        return self.create_combined_features()