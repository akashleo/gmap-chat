from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import os

from models import (
    SearchNearbyRequest, PlaceDetailsRequest, GeocodeRequest, 
    ReverseGeocodeRequest, DirectionsRequest, DistanceMatrixRequest, 
    ElevationRequest, SmartSearchRequest
)
from mcp_client import mcp_request
from gemini_client import get_structured_query_from_gemini

load_dotenv()

app = FastAPI()

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:3000/mcp")

@app.get("/")
def read_root():
    return {"message": "Location App Backend is running!"}

async def call_mcp(tool_name: str, params: dict):
    try:
        response = await mcp_request(MCP_SERVER_URL, tool_name, params)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search-nearby")
async def search_nearby(request: SearchNearbyRequest):
    return await call_mcp("search_nearby", request.dict())

@app.post("/place-details")
async def get_place_details(request: PlaceDetailsRequest):
    return await call_mcp("get_place_details", request.dict())

@app.post("/geocode")
async def geocode(request: GeocodeRequest):
    return await call_mcp("maps_geocode", request.dict())

@app.post("/reverse-geocode")
async def reverse_geocode(request: ReverseGeocodeRequest):
    return await call_mcp("maps_reverse_geocode", request.dict())

@app.post("/directions")
async def get_directions(request: DirectionsRequest):
    return await call_mcp("maps_directions", request.dict())

@app.post("/distance-matrix")
async def get_distance_matrix(request: DistanceMatrixRequest):
    return await call_mcp("maps_distance_matrix", request.dict())

@app.post("/elevation")
async def get_elevation(request: ElevationRequest):
    return await call_mcp("maps_elevation", request.dict())

@app.post("/smart-search")
async def smart_search(request: SmartSearchRequest):
    # 1. Get structured data from Gemini
    structured_query = await get_structured_query_from_gemini(request.query)
    if not structured_query:
        raise HTTPException(status_code=500, detail="Could not process query with AI model.")

    tool_to_use = structured_query.get("tool_to_use")
    primary_query = structured_query.get("primary_query")
    location = structured_query.get("location")

    # 2. Decide which tool to use based on Gemini's output
    if tool_to_use == "search_nearby":
        if not primary_query or not location:
            raise HTTPException(status_code=400, detail="AI model did not provide enough information for search.")
        
        # First, we need to get coordinates for the location string
        geocode_params = {"address": location}
        geocode_result = await call_mcp("maps_geocode", geocode_params)

        # The actual result is nested
        geo_res = geocode_result.get('result', [])
        if not geo_res or 'geometry' not in geo_res[0]:
            raise HTTPException(status_code=404, detail=f"Could not find location: {location}")

        lat = geo_res[0]['geometry']['location']['lat']
        lng = geo_res[0]['geometry']['location']['lng']
        
        # Now, perform the nearby search with the geocoded location
        search_params = {
            "query": primary_query,
            "location": f"{lat},{lng}",
            "radius": 10000 # 10km radius, can be made dynamic
        }
        return await call_mcp("search_nearby", search_params)

    elif tool_to_use == "geocode":
        if not primary_query:
            raise HTTPException(status_code=400, detail="AI model did not provide a location to geocode.")
        
        geocode_params = {"address": primary_query}
        return await call_mcp("maps_geocode", geocode_params)

    # TODO: Implement logic for "directions"
    # This would require handling origin and destination from Gemini's output

    else:
        raise HTTPException(status_code=400, detail=f"AI model suggested an unsupported tool: {tool_to_use}")
