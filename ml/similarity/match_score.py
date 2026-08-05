class MatchScoreCalculator:

    def calculate(self, similarity_score):

        similarity_score = max(
            0.0,
            min(
                float(similarity_score),
                1.0,
            ),
        )

        return round(
            similarity_score * 100,
            2,
        )