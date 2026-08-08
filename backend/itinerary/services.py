import json

from google import genai
from django.conf import settings

from destinations.models import Destination


class ItineraryService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

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

        place = Destination.objects.filter(name__iexact=destination).first()

        if place is None:
            place = Destination.objects.filter(name__icontains=destination).first()

        if place is None:
            return {"error": "Destination not found."}

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

        interests_text = ", ".join(str(interest).strip() for interest in interests)

        prompt = f"""
You are an expert Nepal travel planner.

Generate a realistic, practical, and personalized ROUND-TRIP travel itinerary.

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

Total Trip Length (round trip, including the return journey):
{days} days

Budget Per Person:
NPR {budget}

Travelers:
{travelers}

Travel Pace:
{pace}

Interests:
{interests_text}

===========================================
CRITICAL: THIS IS A ROUND TRIP, NOT ONE-WAY
===========================================

The {days} days represent the ENTIRE trip: travel TO {place.name}, time
SPENT AT {place.name}, and travel BACK to {start_location}.

The trip must NOT end at {place.name}. It must end back at {start_location}.

Do NOT use all {days} days just to arrive at {place.name}. You must budget
days for:
  1. The outbound journey to {place.name} (1 or more days, depending on
     realistic distance/terrain).
  2. Time actually spent at {place.name} (exploring, activities relevant
     to the user's interests) — this is the whole point of the trip and
     must not be skipped, even on short total trip lengths.
  3. The return journey back to {start_location} (1 or more days,
     depending on realistic distance/terrain).

If {days} is too short to realistically include outbound travel, time at
the destination, AND a return journey, prioritize in this order:
  a. At least one full day actually at or near {place.name}.
  b. A realistic (even if brief) outbound and return journey.
  c. Compress travel days rather than removing the stay entirely — do
     not sacrifice time at the destination just to fit a longer return
     stopover.

Route Requirements

- Start the itinerary from {start_location}.
- Consider the actual geography of Nepal.
- Consider realistic road conditions, terrain, transportation and travel times.
- Determine whether {place.name} can realistically be reached from {start_location} within one travel day.
- If {place.name} can realistically be reached within one day, travel directly to {place.name} on day 1.
- If {place.name} cannot realistically be reached within one day, divide the outbound journey into realistic travel stages.
- When necessary, include suitable intermediate towns, villages or settlements along the actual route, both on the way there and on the way back.
- Intermediate locations must be geographically reasonable and naturally located along the route.
- Intermediate locations should be suitable for an overnight stay.
- Do not add intermediate locations simply because there are multiple itinerary days.
- Do not choose unrelated tourist destinations as intermediate stops.
- Avoid unrealistic full-day travel distances.
- The "to" location of one day should normally become the "from" location of the next day.
- After arriving at {place.name}, include at least one day where both "from" and "to" are {place.name} (or a specific point within/near it), representing time spent exploring — unless the total trip length makes this genuinely impossible, in which case explain the compression through the day's description rather than skipping the destination entirely.
- The return journey must begin from {place.name} (or the last point visited near it).
- The FINAL day's "to" MUST be "{start_location}", not {place.name}.
- If an intermediate stop is necessary, focus that day mainly on travel and realistic activities near the stopping location.
- Do not assume that a destination is reachable by road if the destination requires trekking or walking.
- For trekking destinations, include realistic trailheads, villages and overnight stops, both ascending and descending.
- For long mountain journeys, prioritize realistic overnight stopping points on both legs of the trip.
- Do not return to Kathmandu mid-trip unless Kathmandu is genuinely on the realistic route back to {start_location}.

General Itinerary Requirements

- Generate exactly {days} itinerary days, covering the full round trip.
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

- Gradually increase altitude on the way in.
- Avoid unrealistic altitude changes.
- Include appropriate acclimatization.
- Include realistic overnight villages or settlements on both the ascent and the descent.
- Consider walking duration and elevation gain in both directions.
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

Starting And Ending Location Requirements

- The first day's "from" MUST be "{start_location}".
- Every following day's "from" should normally equal the previous day's "to".
- At least one day's "to" (and ideally that day's "from" too, for a following day) must be "{place.name}", representing arrival and time spent there.
- The itinerary MUST include a return journey after the stay at {place.name}.
- The FINAL day's "to" MUST be "{start_location}".
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
Return

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

Return exactly this structure (this 2-day example shows a round trip
pattern — your actual output must have exactly {days} days):

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
        }},
        {{
            "day": 2,
            "title": "Return Journey Home",
            "from": "{place.name}",
            "to": "{start_location}",
            "badge": "Return",
            "description": "Depart {place.name} after breakfast and travel back to {start_location}, arriving in the evening to conclude the trip."
        }}
    ]
}}

The itinerary array MUST contain exactly {days} objects.

Day numbers must start at 1 and increase sequentially.

The first day's "from" MUST be "{start_location}".

The itinerary MUST include real time spent at {place.name}, not just a
same-day arrival-and-departure, unless {days} is 1 (in which case the
single day should still center on {place.name} itself, from and to
{start_location} if a same-day round trip is realistic, or from
{start_location} to {place.name} if a same-day return is not realistic —
choose whichever is geographically honest).

The itinerary MUST include a distinct return journey back to
{start_location} after the stay, when {days} > 1.

The FINAL day's "to" MUST be "{start_location}" when {days} > 1.

If the destination cannot realistically be reached in one day, include
realistic intermediate locations on BOTH the outbound and return legs.

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

            # Structural check: for multi-day trips, the itinerary must
            # actually return to the starting location, not end at the
            # destination. This catches the case where Gemini ignores the
            # round-trip instruction despite the prompt.
            if days > 1:
                last_stop = result["itinerary"][-1]
                if last_stop.get("to", "").strip().lower() != start_location.strip().lower():
                    return {
                        "error": (
                            "Generated itinerary does not return to the "
                            "starting location. Please try again."
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
            return {"error": str(e)}