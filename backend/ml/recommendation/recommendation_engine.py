from ml.config import (
    MIN_SIMILARITY,
    TOP_K,
)

from ml.search.search_engine import SearchEngine
from ml.search.filters import SearchFilter
from ml.search.ranking import SearchRanking

from ml.similarity.match_score import MatchScoreCalculator


class RecommendationEngine:

    def __init__(
        self,
        dataframe,
        similarity_matrix,
    ):

        self.df = dataframe
        self.similarity_matrix = similarity_matrix

        self.search_engine = SearchEngine(dataframe)
        self.search_filter = SearchFilter()
        self.search_ranking = SearchRanking()

        self.match_score = MatchScoreCalculator()

    def recommend(
        self,
        query,
        category=None,
        top_n=TOP_K,
    ):

        query = str(query).strip()

        results = self.search_engine.search(query)

        if category:
            results = self.search_filter.filter_by_category(
                results,
                category,
            )

        if results.empty:
            return None

        results = self.search_ranking.rank(results)

        matched_destination = results.iloc[0]

        destination_name = matched_destination["destination"]

        destination_rows = self.df[
            self.df["destination"]
            .str.lower()
            .eq(destination_name.lower())
        ]

        if destination_rows.empty:
            return None

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