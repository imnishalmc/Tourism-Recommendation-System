import pandas as pd

from ml.search.search_engine import SearchEngine


def get_dataframe():

    return pd.DataFrame(
        {
            "destination": [
                "Pokhara",
                "Chitwan",
                "Annapurna Base Camp",
            ],
            "combined_features": [
                "lake boating nature gandaki",
                "jungle safari wildlife",
                "trekking mountain hiking",
            ],
        }
    )


def test_search_destination():

    engine = SearchEngine(
        get_dataframe()
    )

    results = engine.search(
        "Pokhara"
    )

    assert len(results) == 1

    assert (
        results.iloc[0]["destination"]
        == "Pokhara"
    )


def test_search_keyword():

    engine = SearchEngine(
        get_dataframe()
    )

    results = engine.search(
        "trekking"
    )

    assert len(results) == 1

    assert (
        results.iloc[0]["destination"]
        == "Annapurna Base Camp"
    )


def test_search_partial():

    engine = SearchEngine(
        get_dataframe()
    )

    results = engine.search(
        "Pokh"
    )

    assert len(results) == 1


def test_search_not_found():

    engine = SearchEngine(
        get_dataframe()
    )

    results = engine.search(
        "Everest"
    )

    assert results.empty