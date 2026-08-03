from similarity.match_score import MatchScoreCalculator


calculator = MatchScoreCalculator()

scores = [
     1.00,
    0.92,
    0.87,
    0.75,
    0.63,
    0.48,
    0.31,
    0.15,
    0.00
]

print("Similarity  ->  Match Score")

for score in scores:
    print(
        score,
        " -> ",
        calculator.calculate(score),
        "%"
    )