import numpy as np
from scipy.sparse import csr_matrix

from ml.similarity.cosine_similarity import (
    CosineSimilarityCalculator,
)


def test_cosine_similarity():

    matrix = csr_matrix(
        [
            [1, 0],
            [1, 0],
            [0, 1],
        ]
    )

    similarity = CosineSimilarityCalculator().calculate(
        matrix
    )

    assert similarity.shape == (3, 3)

    assert similarity[0][1] == 1.0
    assert similarity[0][2] == 0.0


def test_similarity_diagonal():

    matrix = csr_matrix(
        [
            [1, 2],
            [3, 4],
        ]
    )

    similarity = CosineSimilarityCalculator().calculate(
        matrix
    )

    assert np.allclose(
        np.diag(similarity),
        1.0,
    )