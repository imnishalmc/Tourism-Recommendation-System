from sklearn.feature_extraction.text import TfidfVectorizer

from ml.config import MAX_FEATURES, NGRAM_RANGE, STOP_WORDS


class TextFeatureExtractor:

    def __init__(self):

        self.vectorizer = TfidfVectorizer(
            stop_words=STOP_WORDS,
            max_features=MAX_FEATURES,
            ngram_range=NGRAM_RANGE
        )

    def extract_features(self, dataframe):

        tfidf_matrix = self.vectorizer.fit_transform(
            dataframe["combined_features"]
        )

        return tfidf_matrix

    def get_feature_names(self):
        return self.vectorizer.get_feature_names_out()