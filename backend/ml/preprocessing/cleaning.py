import pandas as pd


class DataPreprocessor:

    def __init__(self, dataframe):
        self.df = dataframe.copy()

    def remove_duplicates(self):
        self.df.drop_duplicates(inplace=True)
        self.df.reset_index(drop=True, inplace=True)
        return self

    def clean_text_columns(self):
        text_columns = self.df.select_dtypes(include="object").columns

        for column in text_columns:
            self.df[column] = (
                self.df[column]
                .fillna("")
                .astype(str)
                .str.replace(r"\s+", " ", regex=True)
                .str.strip()
            )

        return self

    def clean_numeric_columns(self):
        numeric_columns = self.df.select_dtypes(include=["int64", "float64"]).columns

        for column in numeric_columns:
            self.df[column] = pd.to_numeric(
                self.df[column],
                errors="coerce",
            )

            self.df[column] = self.df[column].fillna(
                self.df[column].median()
            )

        return self

    def clean_categories(self):
        if "main_category" in self.df.columns:
            self.df["main_category"] = (
                self.df["main_category"]
                .fillna("")
                .str.strip()
                .str.title()
            )

        return self

    def preprocess(self):
        (
            self.remove_duplicates()
            .clean_text_columns()
            .clean_numeric_columns()
            .clean_categories()
        )

        return self.df