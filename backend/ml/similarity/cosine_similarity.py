import numpy as np
from scipy.sparse import issparse


class CosineSimilarityCalculator:

    def calculate(self, feature_matrix):
        if feature_matrix is None:
            raise ValueError("Feature matrix cannot be None.")

        if issparse(feature_matrix):
            matrix = feature_matrix.astype(float)
            norms = np.sqrt(matrix.multiply(matrix).sum(axis=1))
            norms = np.asarray(norms).reshape(-1)
            norms[norms == 0] = 1e-10

            normalized_matrix = matrix.multiply(
                1 / norms[:, np.newaxis]
            )

            similarity_matrix = normalized_matrix @ normalized_matrix.T
            similarity_matrix = similarity_matrix.toarray()

        else:
            matrix = np.asarray(feature_matrix, dtype=float)

            if matrix.ndim != 2:
                raise ValueError(
                    "Feature matrix must be a 2-dimensional matrix."
                )

            norms = np.linalg.norm(matrix, axis=1)
            norms[norms == 0] = 1e-10

            normalized_matrix = matrix / norms[:, np.newaxis]

            similarity_matrix = np.dot(
                normalized_matrix,
                normalized_matrix.T
            )

        return np.clip(
            similarity_matrix,
            -1.0,
            1.0
        )