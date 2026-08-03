from similarity.match_score import MatchScoreCalculator


class RecommendationEngine:

    def __init__(self, dataframe, similarity_matrix):
        self.df = dataframe
        self.similarity_matrix = similarity_matrix
        self.match_score = MatchScoreCalculator()

    def recommend(self, destination_name, top_n=10):

        destination = destination_name.lower().strip()

        matches = self.df[
            self.df["destination"]
            .str.lower()
            .str.contains(destination, na=False)
        ]

        if matches.empty:
            return None

        destination_index = matches.index[0]

        similarity_scores = list(
            enumerate(
                self.similarity_matrix[destination_index]
            )
        )

        similarity_scores.sort(
            key=lambda x: x[1],
            reverse=True
        )

        recommendations = []

        for index, similarity in similarity_scores:

            if index == destination_index:
                continue

            row = self.df.iloc[index]

            recommendations.append({
                "destination": row["destination"],
                "district": row["district"],
                "main_category": row["main_category"],
                "ratings": row["ratings"],
                "popularity": row["popularity"],
                "match_score": self.match_score.calculate(similarity)
            })

            if len(recommendations) == top_n:
                break

        return recommendations