from sklearn.preprocessing import OneHotEncoder


class CategoryFeatureExtractor:

    def __init__(self):
        self.encoder = OneHotEncoder(
            sparse_output=False,
            handle_unknown="ignore"
        )

    def extract_features(self, dataframe):

        category_matrix = self.encoder.fit_transform(
            dataframe[["main_category"]]
        )

        return category_matrix

    def get_feature_names(self):
        return self.encoder.get_feature_names_out(["main_category"])