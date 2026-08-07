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
        starting_location=None,
        latitude=None,
        longitude=None,
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

        if starting_location and starting_location.strip():
            start_location = starting_location.strip()
        elif latitude is not None and longitude is not None:
            start_location = "User Current Location"
        else:
            start_location = "Kathmandu"

        gps_info = ""

        if latitude is not None and longitude is not None:
            gps_info = f"""
User GPS Coordinates

Latitude:
{latitude}

Longitude:
{longitude}
"""

        interests_text = ", ".join(
            str(interest).strip()
            for interest in interests
        )

        prompt = f"""
You are an expert Nepal travel planner.

Generate a realistic, practical, and personalized travel itinerary.

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
{", ".join(place.tags) if place.tags else ""}

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

Starting Point

Starting Location:
{start_location}

{gps_info}

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
{interests_text}

Route Requirements

- Start the itinerary from {start_location}.
- Consider the actual geography of Nepal.
- Consider realistic road conditions, terrain, transportation and travel times.
- Determine whether {place.name} can realistically be reached from {start_location} within one travel day.
- If {place.name} can realistically be reached within one day, travel directly to {place.name}.
- If {place.name} cannot realistically be reached within one day, divide the journey into realistic travel stages.
- When necessary, include suitable intermediate towns, villages or settlements along the actual route.
- Intermediate locations must be geographically reasonable and naturally located along the route.
- Intermediate locations should be suitable for an overnight stay.
- Do not add intermediate locations simply because there are multiple itinerary days.
- Do not choose unrelated tourist destinations as intermediate stops.
- Avoid unrealistic full-day travel distances.
- The "to" location of one day should normally become the "from" location of the next day.
- The final travel stage must end at {place.name}.
- If an intermediate stop is necessary, focus that day mainly on travel and realistic activities near the stopping location.
- Do not assume that a destination is reachable by road if the destination requires trekking or walking.
- For trekking destinations, include realistic trailheads, villages and overnight stops.
- For long mountain journeys, prioritize realistic overnight stopping points.
- Do not return to Kathmandu unnecessarily.

General Itinerary Requirements

- Generate exactly {days} itinerary days.
- Consider the user's budget.
- Consider the number of travelers.
- Consider the travel pace.
- Only recommend activities related to the user's interests.
- Use the destination transportation information as a primary reference.
- Never include impossible activities.
- Do not repeat the same activity unnecessarily.
- Use realistic travel times.
- Suggest accommodation when an overnight stay is required.
- Suggest appropriate local meals.
- Estimate realistic travel costs when appropriate.
- Use Nepal travel knowledge only to fill missing information.

Trekking Requirements

- Gradually increase altitude.
- Avoid unrealistic altitude changes.
- Include appropriate acclimatization.
- Include realistic overnight villages or settlements.
- Consider walking duration and elevation gain.
- Include trailhead locations where appropriate.

Nature Requirements

- Include viewpoints.
- Include scenic locations.
- Include nature walks.
- Include sunrise or sunset opportunities when realistic.

Cultural Requirements

- Include temples.
- Include historical places.
- Include local markets.
- Include local food.
- Include cultural experiences.

Wildlife Requirements

- Include safari activities.
- Include nature walks.
- Include realistic wildlife observation activities.
- Respect realistic park schedules.

Adventure Requirements

- Include appropriate adventure activities.
- Do not recommend activities unsuitable for the destination.

Budget Requirements

- Consider NPR {budget} as the budget per person.
- Recommend accommodation appropriate for the budget.
- Recommend transportation appropriate for the budget.
- Recommend reasonably priced local meals.
- Do not recommend luxury services for a low budget.

Travel Pace Requirements

If the pace is relaxed:
- Include fewer activities.
- Include more rest time.
- Avoid long travel days.

If the pace is moderate:
- Maintain a balanced combination of travel, activities and rest.

If the pace is fast:
- Include more activities.
- Use efficient routing.
- Still maintain realistic travel times.

Starting Location Requirements

- The first day's "from" must be "{start_location}".
- Every following day's "from" should normally equal the previous day's "to".
- The final day's "to" must be "{place.name}".
- Do not automatically use Kathmandu unless Kathmandu is the actual starting location.
- If GPS coordinates are provided, use them to estimate the general starting area.
- Do not expose raw GPS coordinates in the final itinerary unless necessary.

Title Requirements

- Each title must contain 2 to 5 words.
- Every title must be unique.
- Titles should describe the main activity or travel stage.

Badge Requirements

- Each badge must contain exactly one word.

Valid badge examples:

Travel
Nature
Culture
Adventure
Trekking
Wildlife
Explore
Relax
Food

Description Requirements

- Each description must contain 20 to 30 words.
- Use simple English.
- Clearly describe the day's activities.
- Mention travel when relevant.
- Keep descriptions concise.
- Do not repeat descriptions.

Plan Type

Generate a suitable plan type based on the user's preferences.

Possible examples:

Balanced Adventure
Relaxed Nature Escape
Cultural Discovery
Budget Adventure
Family Exploration
Mountain Trek
Wildlife Experience

JSON Requirements

Return ONLY valid JSON.

Do NOT return Markdown.

Do NOT return code fences.

Do NOT return explanations.

Do NOT return text before the JSON.

Do NOT return text after the JSON.

Return exactly this structure:

{{
    "destination": "{place.name}",
    "plan_type": "Balanced Plan",
    "days": {days},
    "travelers": {travelers},
    "category": "{place.main_category}",
    "starting_location": "{start_location}",
    "itinerary": [
        {{
            "day": 1,
            "title": "Travel to Destination",
            "from": "{start_location}",
            "to": "{place.name}",
            "badge": "Travel",
            "description": "Travel from {start_location} to {place.name}, check into your accommodation, explore nearby attractions and enjoy authentic local cuisine."
        }}
    ]
}}

The itinerary array MUST contain exactly {days} objects.

Day numbers must start at 1 and increase sequentially.

The first day's "from" MUST be "{start_location}".

Every following day's "from" should normally equal the previous day's "to".

The final day's "to" MUST be "{place.name}".

If the destination cannot realistically be reached in one day, include realistic intermediate locations.

Do not add unnecessary intermediate locations.

Every itinerary object MUST contain:

day
title
from
to
badge
description

Return JSON only.
"""

        try:

            response = self.client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt,
            )

            text = response.text.strip()

            if text.startswith("```json"):
                text = text.replace("```json", "", 1).strip()

            elif text.startswith("```"):
                text = text.replace("```", "", 1).strip()

            if text.endswith("```"):
                text = text[:-3].strip()

            result = json.loads(text)

            if "itinerary" not in result:
                return {
                    "error": "Gemini response does not contain an itinerary.",
                    "raw_response": text,
                }

            if len(result["itinerary"]) != days:
                return {
                    "error": (
                        f"Expected {days} itinerary days, "
                        f"but Gemini returned "
                        f"{len(result['itinerary'])} days."
                    ),
                    "raw_response": result,
                }

            result["starting_location"] = start_location

            return result

        except json.JSONDecodeError:
            return {
                "error": "Gemini returned invalid JSON.",
                "raw_response": text,
            }

        except Exception as e:
            return {
                "error": str(e)
            }