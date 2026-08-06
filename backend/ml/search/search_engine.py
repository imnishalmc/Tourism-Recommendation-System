class SearchEngine:

    def __init__(self, dataframe):
        self.df = dataframe.copy()

    def search(self, query):

        query = str(query).lower().strip()

        results = self.df[
            (
                self.df["destination"]
                .str.lower()
                .str.contains(query, na=False)
            )
            |
            (
                self.df["combined_features"]
                .str.lower()
                .str.contains(query, na=False)
            )
        ].copy()

        if results.empty:
            return results

        results["search_score"] = 0

        # Exact destination match
        results.loc[
            results["destination"]
            .str.lower()
            .eq(query),
            "search_score"
        ] += 10

        # Partial destination match
        results.loc[
            results["destination"]
            .str.lower()
            .str.contains(query, na=False),
            "search_score"
        ] += 5

        # Keyword match
        results.loc[
            results["combined_features"]
            .str.lower()
            .str.contains(query, na=False),
            "search_score"
        ] += 2

        return results.sort_values(
            by="search_score",
            ascending=False
        ).reset_index(drop=True)

    def search_by_destination(self, destination_name):

        return self.df[
            self.df["destination"]
            .str.lower()
            .eq(destination_name.lower())
        ].reset_index(drop=True)

    def search_by_keyword(self, keyword):
        return self.search(keyword)