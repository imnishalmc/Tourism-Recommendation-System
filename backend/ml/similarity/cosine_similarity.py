from sklearn.metrics.pairwise import cosine_similarity


class CosineSimilarityCalculator:

    def calculate(self, feature_matrix):

        if feature_matrix is None:
            raise Value
            Error("Feature matrix cannot be None.")

        return cosine_similarity(feature_matrix)