import re

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer


class TextPreprocessor:

    def __init__(self, dataframe):
        self.df = dataframe.copy()
        self.stop_words = set(stopwords.words("english"))
        self.lemmatizer = WordNetLemmatizer()

    def clean_text(self, text):

        if not text:
            return ""

        text = str(text).lower()
        text = re.sub(r"[^a-zA-Z\s]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()

        words = []

        for word in text.split():
            if word not in self.stop_words:
                words.append(
                    self.lemmatizer.lemmatize(word)
                )

        return " ".join(words)

    def preprocess_columns(self, columns):
        for column in columns:
            if column in self.df.columns:
                self.df[column] = self.df[column].apply(
                    self.clean_text
                )

        return self.df

    def preprocess(self):
        columns = [
            "description",
            "tags",
            "activities",
            "transportation",
        ]

        return self.preprocess_columns(columns)