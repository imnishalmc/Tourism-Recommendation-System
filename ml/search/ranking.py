class SearchRanking:

    def rank(self, dataframe):

        ranked_df = dataframe.sort_values(
            by=[
                "ratings",
                "popularity"
            ],
            ascending=[
                False,
                False
            ]
        )

        return ranked_df.reset_index(drop=True)