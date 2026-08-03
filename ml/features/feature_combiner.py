from scipy.sparse import csr_matrix, hstack


class FeatureCombiner:

    def combine(
        self,
        text_matrix,
        category_matrix,
        numeric_matrix,
        difficulty_matrix,
    ):

        combined_matrix = hstack([
            text_matrix,
            csr_matrix(category_matrix),
            csr_matrix(numeric_matrix),
            csr_matrix(difficulty_matrix)
        ])

        return combined_matrix