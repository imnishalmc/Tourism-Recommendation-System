import json
import pandas as pd

from google import genai
from django.conf import settings

from ml.config import DATASET_PATH


class ItineraryService:

    def __init__(self):
        self.df = pd.read_csv(DATASET_PATH)
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    def generate(
        self,
        destination,
        days,
        budget,
        travelers,
        pace,
        interests,
    ):

        destination = destination.strip().lower()

        matches = self.df[
            self.df["destination"]
            .astype(str)
            .str.lower()
            .str.contains(destination, na=False)
        ]

        if matches.empty:
            return {
                "error": "Destination not found."
            }

        place = matches.iloc[0]

        prompt = f"""
You are an expert Nepal travel planner.

Generate a realistic travel itinerary.

Use the destination information below as the PRIMARY source.

Destination Information

Destination:
{place["destination"]}

District:
{place["district"]}

Province:
{place["province"]}

Best Season:
{place["best_season"]}

Category:
{place["main_category"]}

Tags:
{place["tags"]}

Activities:
{place["activities"]}

Difficulty:
{place["difficulty_level"]}

Accessibility:
{place["accessibility"]}

Transportation:
{place["transportation"]}

Description:
{place["description"]}

Popularity:
{place["popularity"]}

Ratings:
{place["ratings"]}

Crowd Level:
{place["crowd_level"]}

Latitude:
{place["latitude"]}

Longitude:
{place["longitude"]}

Sample Reviews:
{place["attraction_sample_reviews"]}

Total Reviews:
{place["attraction_total_reviews"]}

User Preferences

Trip Length:
{days} days

Budget Per Person:
NPR {budget}

Travelers:
{travelers}

Travel Pace:
{pace}

Interests:
{", ".join(interests)}

Instructions

- Start every trip from Kathmandu.
- Follow realistic road conditions and travel time.
- Use transportation mentioned in the dataset.
- Never include impossible activities in one day.
- Trekking destinations should gradually increase altitude.
- Nature destinations should include viewpoints.
- Cultural destinations should include local food and markets.
- Wildlife destinations should include safari or nature walks.
- Suggest accommodation whenever an overnight stay is needed.
- Suggest local meals.
- Estimate reasonable travel costs.
- Use your own Nepal travel knowledge ONLY to fill missing details.
- Return ONLY VALID JSON.

Return exactly in this format:

{{
    "destination": "{place["destination"]}",
    "plan_type": "Balanced Plan",
    "days": {days},
    "travelers": {travelers},
    "category": "{place["main_category"]}",
    "estimated_total_cost": 0,
    "estimated_cost_per_person": 0,
    "itinerary": [
        {{
            "day": 1,
            "title": "Journey Begins",
            "from": "Kathmandu",
            "to": "{place["destination"]}",
            "badge": "Travel",
            "description": "..."
        }}
    ]
}}

Do not return markdown.

Return JSON only.
"""

        try:

            response = self.client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt,
            )

            text = response.text.strip()

            if text.startswith("```json"):
                text = text.replace("```json", "")

            if text.startswith("```"):
                text = text.replace("```", "")

            text = text.replace("```", "").strip()

            return json.loads(text)

        except json.JSONDecodeError:
            return {
                "error": "Gemini returned invalid JSON.",
                "raw_response": text
            }

        except Exception as e:
            return {
                "error": str(e)
            }