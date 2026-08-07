import pandas as pd

from ml.search.filters import SearchFilter


def test_filter_by_category():

    df = pd.DataFrame(
        {
            "destination": [
                "Pokhara",
                "Chitwan",
            ],
            "main_category": [
                "Nature",
                "Wildlife",
            ],
        }
    )

    filtered = SearchFilter().filter_by_category(
        df,
        "Nature",
    )

    assert len(filtered) == 1

    assert (
        filtered.iloc[0]["destination"]
        == "Pokhara"
    )


def test_filter_none():

    df = pd.DataFrame(
        {
            "destination": [
                "Pokhara",
            ],
            "main_category": [
                "Nature",
            ],
        }
    )

    filtered = SearchFilter().filter_by_category(
        df,
        None,
    )

    assert len(filtered) == 1