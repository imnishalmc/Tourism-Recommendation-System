from sklearn.preprocessing import MinMaxScaler


class NumericFeatureExtractor:

    def __init__(self):
        self.scaler = MinMaxScaler()

    def extract_features(self, dataframe):

        numeric_columns = [
            "ratings",
            "popularity",
            "attraction_total_reviews"
        ]

        numeric_matrix = self.scaler.fit_transform(
            dataframe[numeric_columns]
        )

        return numeric_matrix

    def get_feature_names(self):
        return [
            "ratings",
            "popularity",
            "attraction_total_reviews"
        ]