import pandas as pd
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
            self.df["destination"].str.lower().eq(str(destination_name).strip().lower())
        ]

        if destination_rows.empty:
            return None

        matched_destination = destination_rows.iloc[0]
        destination_index = destination_rows.index[0]

        similarity_scores = list(enumerate(self.similarity_matrix[destination_index]))

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

            if category and row["main_category"] != category:
                continue

            recommendations.append(
                {
                    # Database ID
                    "id": (int(row["id"]) if pd.notna(row["id"]) else None),
                    "destination": row["destination"],
                    "district": row["district"],
                    "province": row["province"],
                    "main_category": row["main_category"],
                    "ratings": (
                        float(row["ratings"]) if pd.notna(row["ratings"]) else 0
                    ),
                    "popularity": (
                        float(row["popularity"]) if pd.notna(row["popularity"]) else 0
                    ),
                    # Additional destination information
                    "image_url": (
                        row["image_url"] if pd.notna(row["image_url"]) else None
                    ),
                    "difficulty_level": (
                        row["difficulty_level"]
                        if pd.notna(row["difficulty_level"])
                        else None
                    ),
                    "crowd_level": (
                        row["crowd_level"] if pd.notna(row["crowd_level"]) else None
                    ),
                    "budget_level": (
                        row["budget_level"] if pd.notna(row["budget_level"]) else None
                    ),
                    "description": (
                        row["description"] if pd.notna(row["description"]) else None
                    ),
                    "similarity": round(
                        float(similarity),
                        3,
                    ),
                    "match_score": self.match_score.calculate(similarity),
                }
            )

            if len(recommendations) >= top_n:
                break

        return {
            "matched_destination": {
                "id": (
                    int(matched_destination["id"])
                    if pd.notna(matched_destination["id"])
                    else None
                ),
                "destination": matched_destination["destination"],
                "district": matched_destination["district"],
                "province": matched_destination["province"],
                "main_category": matched_destination["main_category"],
                "ratings": (
                    float(matched_destination["ratings"])
                    if pd.notna(matched_destination["ratings"])
                    else 0
                ),
                "popularity": (
                    float(matched_destination["popularity"])
                    if pd.notna(matched_destination["popularity"])
                    else 0
                ),
                "image_url": (
                    matched_destination["image_url"]
                    if pd.notna(matched_destination["image_url"])
                    else None
                ),
                "difficulty_level": (
                    matched_destination["difficulty_level"]
                    if pd.notna(matched_destination["difficulty_level"])
                    else None
                ),
                "crowd_level": (
                    matched_destination["crowd_level"]
                    if pd.notna(matched_destination["crowd_level"])
                    else None
                ),
                "budget_level": (
                    matched_destination["budget_level"]
                    if pd.notna(matched_destination["budget_level"])
                    else None
                ),
                "description": (
                    matched_destination["description"]
                    if pd.notna(matched_destination["description"])
                    else None
                ),
            },
            "recommendations": recommendations,
        }
