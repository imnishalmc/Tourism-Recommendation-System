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

    def filter_by_province(
        self,
        dataframe,
        province,
    ):

        if not province:
            return dataframe

        province = province.lower().strip()

        filtered_df = dataframe[
            dataframe["province"]
            .astype(str)
            .str.lower()
            .eq(province)
        ]

        return filtered_df.reset_index(drop=True)
    # this is the file that is responsible for filtering the dataframe based on category and province.
    #  Each method takes a dataframe and a category or province as input, and returns a filtered dataframe that only contains rows that match the specified category or province.
    #  If no category or province is provided, the original dataframe is returned.  
     