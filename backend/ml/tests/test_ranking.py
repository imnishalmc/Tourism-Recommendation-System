import pandas as pd

from ml.search.ranking import SearchRanking


def test_ranking():

    df = pd.DataFrame(
        {
            "destination": [
                "A",
                "B",
                "C",
            ],
            "search_score": [
                2,
                10,
                5,
            ],
            "ratings": [
                4.0,
                5.0,
                3.5,
            ],
            "popularity": [
                100,
                200,
                150,
            ],
        }
    )

    ranked = SearchRanking().rank(df)

    assert ranked.iloc[0]["destination"] == "B"
    assert ranked.iloc[1]["destination"] == "C"
    assert ranked.iloc[2]["destination"] == "A"