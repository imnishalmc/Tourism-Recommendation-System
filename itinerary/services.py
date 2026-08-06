import json

from google import genai
from django.conf import settings

from destinations.models import Destination


class ItineraryService:

    def __init__(self):
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

        destination = destination.strip()

        place = Destination.objects.filter(
            name__iexact=destination
        ).first()

        if place is None:
            place = Destination.objects.filter(
                name__icontains=destination
            ).first()

        if place is None:
            return {
                "error": "Destination not found."
            }

        prompt = f"""
You are an expert Nepal travel planner.

Generate a realistic travel itinerary.

Use the destination information below as the PRIMARY source.

Destination Information

Destination:
{place.name}

District:
{place.district}

Province:
{place.province}

Best Season:
{place.best_season}

Category:
{place.main_category}

Tags:
{", ".join(place.tags)}

Activities:
{place.activities}

Difficulty:
{place.difficulty_level}

Accessibility:
{place.accessibility}

Transportation:
{place.transportation}

Description:
{place.description}

Ratings:
{place.ratings}

Popularity:
{place.popularity}

Crowd Level:
{place.crowd_level}

Budget Level:
{place.budget_level}

Recommended Visit Duration:
{place.visit_duration_days} days

Latitude:
{place.latitude}

Longitude:
{place.longitude}

Total Reviews:
{place.attraction_total_reviews}

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

- Start the trip from Kathmandu.
- Follow realistic travel routes.
- consider budget as well
- Use the transportation mentioned above as reference.
- Never include impossible activities.
- Trekking destinations should gradually increase altitude.
- Nature destinations should include viewpoints.
- Cultural destinations should include temples, local markets and local food.
- Wildlife destinations should include safari or nature walks.
- Suggest accommodation whenever an overnight stay is needed.
- Suggest local meals.
- Estimate realistic travel costs.
- Use your own Nepal travel knowledge ONLY to fill missing details.
- Generate exactly {days} itinerary days.
- Keep each title between 2 and 5 words.
- Keep each badge to one word.
- Keep each description between 20 and 30 words.
- Use simple English.
- Every day should have a unique title.
- Do not repeat activities.
- Return ONLY valid JSON.
- Do NOT return Markdown.
- Do NOT return explanations.

Return exactly in this format:

{{
    "destination": "{place.name}",
    "plan_type": "Balanced Plan",
    "days": {days},
    "travelers": {travelers},
    "category": "{place.main_category}",
    "itinerary": [
        {{
            "day": 1,
            "title": "Drive to {place.name}",
            "from": "Kathmandu",
            "to": "{place.name}",
            "badge": "Travel",
            "description": "Travel from Kathmandu to {place.name}, check into your hotel, explore nearby attractions and enjoy authentic local cuisine."
        }}
    ]
}}

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
                "raw_response": text,
            }

        except Exception as e:

            return {
                "error": str(e)
            }