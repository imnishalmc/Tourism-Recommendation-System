class MatchScoreCalculator:

    def calculate(self, similarity_score):

        if similarity_score < 0:
            similarity_score = 0

        if similarity_score > 1:
            similarity_score = 1

        return round(similarity_score * 100, 2)