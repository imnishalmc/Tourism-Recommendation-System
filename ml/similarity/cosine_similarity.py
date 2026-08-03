from sklearn.metrics.pairwise import cosine_similarity


class CosineSimilarityCalculator:

    def calculate(self, feature_matrix):

        similarity_matrix = cosine_similarity(feature_matrix)

        return similarity_matrix