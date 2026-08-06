class SearchFilter:

    def filter_by_category(
        self,
        dataframe,
        category,
    ):

        if not category:
            return dataframe

        category = category.lower().strip()

        filtered_df = dataframe[
            dataframe["main_category"]
            .str.lower()
            .eq(category)
        ]

        return filtered_df.reset_index(drop=True)