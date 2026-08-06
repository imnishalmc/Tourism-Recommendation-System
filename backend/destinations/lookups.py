
DIFFICULTY_NORMALIZATION = {
    'Very Easy': 'easy',
    'Easy': 'easy',
    'Easy-Moderate': 'moderate',    
    'Easy–Moderate': 'moderate',       
    'Easy–Medium': 'moderate',
    'Medium': 'moderate',
    'Moderate': 'moderate',
    'Moderate-High': 'hard',
    'Medium–Hard': 'hard',
    'Hard': 'hard',
    'Hard (permit)': 'hard',
    'Challenging': 'hard',
    'High': 'hard',
    'Very Difficult': 'very_hard',
}

# Maps the exact CSV category labels to our internal choice keys
MAIN_CATEGORY_NORMALIZATION = {
    'Natural Attractions': 'natural',
    'Village & Rural Tourism': 'village_rural',
    'Cultural & Religious Sites': 'cultural_religious',
    'Urban & Modern Attractions': 'urban_modern',
    'Trekking & Adventure': 'trekking_adventure',
    'Wildlife & Conservation': 'wildlife_conservation',
    'Wellness & Relaxation': 'wellness_relaxation',
}

# (main_category, difficulty) → (budget_level, visit_duration_days)
# Documented heuristic — not sourced per-destination. State this explicitly in your report.
BUDGET_DURATION_LOOKUP = {
    ('cultural_religious', 'easy'):        ('low',    0.15),
    ('cultural_religious', 'moderate'):    ('low',    0.25),
    ('cultural_religious', 'hard'):        ('medium', 0.4),
    ('cultural_religious', 'very_hard'):   ('medium', 0.5),

    ('natural', 'easy'):                   ('low',    0.2),
    ('natural', 'moderate'):               ('medium', 0.35),
    ('natural', 'hard'):                   ('medium', 0.6),
    ('natural', 'very_hard'):              ('high',   1),

    ('village_rural', 'easy'):             ('low',    0.3),
    ('village_rural', 'moderate'):         ('low',    0.4),
    ('village_rural', 'hard'):             ('medium', 0.6),
    ('village_rural', 'very_hard'):        ('medium', 1),

    ('urban_modern', 'easy'):              ('low',    0.2),
    ('urban_modern', 'moderate'):          ('medium', 0.3),
    ('urban_modern', 'hard'):              ('medium', 0.4),
    ('urban_modern', 'very_hard'):         ('high',   0.5),

    # 'hard' here is a placeholder default for un-curated trek entries —
    # any destination we build a real TrekRoute for later gets its actual
    # total_days from that route instead, overriding this default.
    ('trekking_adventure', 'easy'):        ('medium', 0.5),
    ('trekking_adventure', 'moderate'):    ('medium', 1),
    ('trekking_adventure', 'hard'):        ('high',   7),
    ('trekking_adventure', 'very_hard'):   ('high',   10),

    ('wildlife_conservation', 'easy'):     ('medium', 0.5),
    ('wildlife_conservation', 'moderate'): ('medium', 1),
    ('wildlife_conservation', 'hard'):     ('high',   1.5),
    ('wildlife_conservation', 'very_hard'):('high',   2),

    ('wellness_relaxation', 'easy'):       ('medium', 0.5),
    ('wellness_relaxation', 'moderate'):   ('medium', 1),
    ('wellness_relaxation', 'hard'):       ('high',   1.5),
    ('wellness_relaxation', 'very_hard'):  ('high',   2),
}