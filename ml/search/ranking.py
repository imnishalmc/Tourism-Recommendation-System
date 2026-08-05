class SearchRanking:

    def rank(self, dataframe):

        ranked_df = dataframe.sort_values(
            by=[
                "search_score",
                "ratings",
                "popularity",
            ],
            ascending=[
                False,
                False,
                False,
            ],
        )

        return ranked_df.reset_index(drop=True)