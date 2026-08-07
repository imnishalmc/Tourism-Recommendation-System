class SearchEngine:

    def __init__(self, dataframe):
        self.df = dataframe.copy()

    def search(self, query):

        query = str(query).lower().strip()

        if not query:
            return self.df.copy()

        searchable_columns = [
            "destination",
            "description",
            "tags",
            "activities",
            "main_category",
            "district",
            "province",
            "best_season",
            "transportation",
            "accessibility",
            "difficulty_level",
        ]

        mask = False

        for column in searchable_columns:
            if column in self.df.columns:
                mask = (
                    mask
                    | self.df[column]
                    .fillna("")
                    .astype(str)
                    .str.lower()
                    .str.contains(
                        query,
                        na=False,
                    )
                )

        results = self.df[mask].copy()

        if results.empty:
            return results

        results["search_score"] = 0

        results.loc[
            results["destination"]
            .fillna("")
            .astype(str)
            .str.lower()
            .eq(query),
            "search_score",
        ] += 10

        results.loc[
            results["destination"]
            .fillna("")
            .astype(str)
            .str.lower()
            .str.contains(
                query,
                na=False,
            ),
            "search_score",
        ] += 5

        for column in searchable_columns:

            if column == "destination":
                continue

            if column not in results.columns:
                continue

            results.loc[
                results[column]
                .fillna("")
                .astype(str)
                .str.lower()
                .str.contains(
                    query,
                    na=False,
                ),
                "search_score",
            ] += 2

        return results.sort_values(
            by="search_score",
            ascending=False,
        ).reset_index(drop=True)

    def search_by_destination(
        self,
        destination_name,
    ):

        destination_name = (
            str(destination_name)
            .lower()
            .strip()
        )

        return self.df[
            self.df["destination"]
            .fillna("")
            .astype(str)
            .str.lower()
            .eq(destination_name)
        ].reset_index(drop=True)

    def search_by_keyword(self, keyword):

        return self.search(keyword)