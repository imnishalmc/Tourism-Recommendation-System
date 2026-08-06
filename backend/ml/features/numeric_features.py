from sklearn.preprocessing import MinMaxScaler
from ml.config import NUMERIC_COLUMNS

class NumericFeatureExtractor:

    def __init__(self):
        self.scaler = MinMaxScaler()

    def extract_features(self, dataframe):
        numeric_matrix = self.scaler.fit_transform(
            dataframe[NUMERIC_COLUMNS]
        )
        return numeric_matrix

    def get_feature_names(self):
        return NUMERIC_COLUMNS