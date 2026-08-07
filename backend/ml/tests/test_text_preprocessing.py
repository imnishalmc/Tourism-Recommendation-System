import pandas as pd

from ml.preprocessing.text_preprocessing import TextPreprocessor


def test_clean_text():

    df = pd.DataFrame(
        {
            "description": [
                "Beautiful Lakes!!!"
            ]
        }
    )

    processor = TextPreprocessor(df)

    text = processor.clean_text(
        "Beautiful Lakes!!!"
    )

    assert "beautiful" in text
    assert "lake" in text


def test_preprocess_columns():

    df = pd.DataFrame(
        {
            "description": [
                "Beautiful Lakes!!!"
            ]
        }
    )

    processor = TextPreprocessor(df)

    processed = processor.preprocess_columns(
        ["description"]
    )

    assert processed.loc[0, "description"] != ""