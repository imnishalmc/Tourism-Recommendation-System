from ml.config import (
    MIN_SIMILARITY,
    TOP_K,
)

from ml.similarity.match_score import MatchScoreCalculator


class RecommendationEngine:

    def __init__(
        self,
        dataframe,
        similarity_matrix,
    ):
        self.df = dataframe
        self.similarity_matrix = similarity_matrix
        self.match_score = MatchScoreCalculator()

    def recommend(
        self,
        destination_name,
        category=None,
        top_n=TOP_K,
    ):

        destination_rows = self.df[
            self.df["destination"]
            .str.lower()
            .eq(str(destination_name).strip().lower())
        ]

        if destination_rows.empty:
            return None

        matched_destination = destination_rows.iloc[0]
        destination_index = destination_rows.index[0]

        similarity_scores = list(
            enumerate(
                self.similarity_matrix[destination_index]
            )
        )

        similarity_scores.sort(
            key=lambda x: x[1],
            reverse=True,
        )

        recommendations = []

        for index, similarity in similarity_scores:

            if index == destination_index:
                continue

            if similarity < MIN_SIMILARITY:
                continue

            row = self.df.iloc[index]

            if (
                category
                and row["main_category"] != category
            ):
                continue

            recommendations.append(
                {
                    "destination": row["destination"],
                    "district": row["district"],
                    "province": row["province"],
                    "main_category": row["main_category"],
                    "ratings": row["ratings"],
                    "popularity": row["popularity"],
                    "similarity": round(
                        float(similarity),
                        3,
                    ),
                    "match_score": self.match_score.calculate(
                        similarity
                    ),
                }
            )

            if len(recommendations) >= top_n:
                break

        return {
            "matched_destination": {
                "destination": matched_destination["destination"],
                "district": matched_destination["district"],
                "province": matched_destination["province"],
                "main_category": matched_destination["main_category"],
                "ratings": matched_destination["ratings"],
                "popularity": matched_destination["popularity"],
            },
            "recommendations": recommendations,
        }