import pandas as pd

from destinations.models import Destination

from ml.preprocessing.cleaning import DataPreprocessor
from ml.preprocessing.text_preprocessing import TextPreprocessor

from ml.search.search_engine import SearchEngine
from ml.search.filters import SearchFilter
from ml.search.ranking import SearchRanking


class SearchService:

    def __init__(self):
        self.df = pd.DataFrame()
        self.search_engine = None
        self.search_filter = SearchFilter()
        self.search_ranking = SearchRanking()

        self.load_data()

    def load_data(self):

        destinations = Destination.objects.all()

        if not destinations.exists():
            self.df = pd.DataFrame()
            self.search_engine = None
            return

        data = []

        for destination in destinations:
            data.append(
                {
                    "id": destination.id,
                    "destination": destination.name,
                    "district": destination.district,
                    "province": destination.province,
                    "best_season": destination.best_season,
                    "main_category": destination.main_category,
                    "description": destination.description,
                    "tags": ", ".join(destination.tags)
                    if destination.tags
                    else "",
                    "activities": destination.activities,
                    "accessibility": destination.accessibility,
                    "transportation": destination.transportation,
                    "difficulty_level": destination.difficulty_level,
                    "ratings": destination.ratings,
                    "popularity": destination.popularity,
                    "attraction_total_reviews": destination.attraction_total_reviews,
                    "budget_level": destination.budget_level,
                    "crowd_level": destination.crowd_level,
                    "visit_duration_days": destination.visit_duration_days,
                    "is_trek_entry": destination.is_trek_entry,
                }
            )

        df = pd.DataFrame(data)

        clean_df = DataPreprocessor(df).preprocess()

        processed_df = TextPreprocessor(
            clean_df
        ).preprocess()

        self.df = processed_df

        self.search_engine = SearchEngine(
            processed_df
        )

    def search(
        self,
        query=None,
        category=None,
        province=None,
        district=None,
        difficulty=None,
        budget=None,
        crowd=None,
        is_trek_entry=None,
    ):

        if self.search_engine is None:
            return pd.DataFrame()

        results = self.search_engine.search(query)

        if results.empty:
            return results

        results = self.search_filter.filter_by_category(
            results,
            category,
        )

        results = self.search_filter.filter_by_province(
            results,
            province,
        )

        if district:
            results = results[
                results["district"]
                .astype(str)
                .str.lower()
                .eq(
                    str(district).strip().lower()
                )
            ].reset_index(drop=True)

        if difficulty:
            results = results[
                results["difficulty_level"]
                .astype(str)
                .str.lower()
                .eq(
                    str(difficulty).strip().lower()
                )
            ].reset_index(drop=True)

        if budget:
            results = results[
                results["budget_level"]
                .astype(str)
                .str.lower()
                .eq(
                    str(budget).strip().lower()
                )
            ].reset_index(drop=True)
        if crowd:
            results = results[
                results["crowd_level"]
                .astype(str)
                .str.lower()
                .eq(
                    str(crowd).strip().lower()
                )
            ]

        if is_trek_entry is not None:
            if isinstance(is_trek_entry, bool):
                trek_value = is_trek_entry
            else:
                trek_value = str(is_trek_entry).lower() == "true"

            results = results[
                results["is_trek_entry"] == trek_value
            ]
        if results.empty:
            return results

        return self.search_ranking.rank(results)  