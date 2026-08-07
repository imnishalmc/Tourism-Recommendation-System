from ml.similarity.match_score import (
    MatchScoreCalculator,
)


def test_match_score():

    calculator = MatchScoreCalculator()

    assert calculator.calculate(1.0) == 100.0
    assert calculator.calculate(0.5) == 50.0
    assert calculator.calculate(0.0) == 0.0


def test_match_score_bounds():

    calculator = MatchScoreCalculator()

    assert calculator.calculate(2.0) == 100.0
    assert calculator.calculate(-1.0) == 0.0