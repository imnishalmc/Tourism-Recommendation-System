class SearchEngine:

    def __init__(self, dataframe):
        self.df = dataframe.copy()

    def search(self, query):

        query = str(query).lower().strip()

        if not query:
            return self.df.copy()

        # Restrict search to destination name and location fields only
        searchable_columns = [
            "destination",
            "district",
            "province",
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

        # Scoring: prioritize exact destination name, then partial destination,
        # then exact district/province, then partial district/province.
        results["search_score"] = 0

        # exact destination name
        results.loc[
            results["destination"].fillna("").astype(str).str.lower().eq(query),
            "search_score",
        ] += 10

        # partial destination match
        results.loc[
            results["destination"]
            .fillna("")
            .astype(str)
            .str.lower()
            .str.contains(query, na=False),
            "search_score",
        ] += 5

        # exact district/province match
        for loc_col in ("district", "province"):
            if loc_col in results.columns:
                results.loc[
                    results[loc_col].fillna("").astype(str).str.lower().eq(query),
                    "search_score",
                ] += 4

                # partial district/province match
                results.loc[
                    results[loc_col]
                    .fillna("")
                    .astype(str)
                    .str.lower()
                    .str.contains(query, na=False),
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