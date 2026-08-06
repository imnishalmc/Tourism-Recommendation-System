import pandas as pd

from ml.preprocessing.cleaning import DataPreprocessor


def test_remove_duplicates():

    df = pd.DataFrame(
        {
            "destination": ["Pokhara", "Pokhara"],
            "ratings": [4.8, 4.8],
        }
    )

    cleaned = DataPreprocessor(df).remove_duplicates().df

    assert len(cleaned) == 1


def test_clean_text_columns():

    df = pd.DataFrame(
        {
            "destination": ["  Pokhara   "],
            "description": [" Beautiful    Lake City "],
        }
    )

    cleaned = DataPreprocessor(df).clean_text_columns().df

    assert cleaned.loc[0, "destination"] == "Pokhara"
    assert cleaned.loc[0, "description"] == "Beautiful Lake City"


def test_clean_numeric_columns():

    df = pd.DataFrame(
        {
            "ratings": [4.5, None, 5.0],
        }
    )

    cleaned = DataPreprocessor(df).clean_numeric_columns().df

    assert cleaned["ratings"].isnull().sum() == 0


def test_clean_categories():

    df = pd.DataFrame(
        {
            "main_category": [" nature "],
        }
    )

    cleaned = DataPreprocessor(df).clean_categories().df

    assert cleaned.loc[0, "main_category"] == "Nature"