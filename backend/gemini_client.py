import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure the Gemini API client
try:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

async def get_structured_query_from_gemini(natural_language_query: str) -> dict:
    """
    Sends a natural language query to Gemini and asks it to return a structured
    JSON object that can be used to call Google Maps tools.
    """
    if not model:
        raise ConnectionError("Gemini API is not configured. Please check your API key and environment.")

    prompt = f"""
    You are a helpful assistant for a location-based application. Your task is to parse a user's natural language query and convert it into a structured JSON object. This JSON will be used to call Google Maps APIs.

    The JSON object should have the following fields:
    - "tool_to_use": The most appropriate Google Maps tool to call. Possible values are: "search_nearby", "geocode", "directions".
    - "primary_query": The main search term (e.g., 'coffee shop', 'park').
    - "location": The reference location for the search (e.g., 'Eiffel Tower', 'San Francisco, CA'). If the query implies the user's current location, use "user's current location".
    - "attributes": A list of any specific attributes or constraints mentioned (e.g., 'open now', 'good reviews', 'wheelchair accessible').

    Here are some examples:

    User Query: "find a coffee shop near the Empire State Building that has good reviews"
    JSON Output:
    {{
      "tool_to_use": "search_nearby",
      "primary_query": "coffee shop",
      "location": "Empire State Building",
      "attributes": ["good reviews"]
    }}

    User Query: "how do I get to the airport from my hotel?"
    JSON Output:
    {{
      "tool_to_use": "directions",
      "primary_query": "airport",
      "location": "my hotel",
      "attributes": []
    }}

    User Query: "where is the Eiffel Tower?"
    JSON Output:
    {{
      "tool_to_use": "geocode",
      "primary_query": "Eiffel Tower",
      "location": "",
      "attributes": []
    }}

    Now, parse the following user query:

    User Query: "{natural_language_query}"
    JSON Output:
    """

    try:
        response = model.generate_content(prompt)
        # The response often comes in a markdown code block, so we need to clean it.
        cleaned_json_string = response.text.strip().replace('```json', '').replace('```', '').strip()
        return json.loads(cleaned_json_string)
    except Exception as e:
        print(f"Error communicating with Gemini: {e}")
        return None
