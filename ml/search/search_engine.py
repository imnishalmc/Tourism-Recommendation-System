class SearchEngine:

    def __init__(self, dataframe):
        self.df = dataframe.copy()

    def search(self, query):

        query = query.lower().strip()

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
        ]

        return results.reset_index(drop=True)

    def search_by_destination(self, destination_name):

        results = self.df[
            self.df["destination"]
            .str.lower()
            == destination_name.lower()
        ]

        return results.reset_index(drop=True)

    def search_by_keyword(self, keyword):

        keyword = keyword.lower().strip()

        results = self.df[
            self.df["combined_features"]
            .str.lower()
            .str.contains(keyword, na=False)
        ]

        return results.reset_index(drop=True)