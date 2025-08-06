from pydantic import BaseModel
from typing import Optional, List

class SearchNearbyRequest(BaseModel):
    query: str
    location: str # e.g., "lat,lng"
    radius: int
    type: Optional[str] = None
    keyword: Optional[str] = None

class PlaceDetailsRequest(BaseModel):
    place_id: str
    fields: Optional[str] = None # Comma-separated list of fields

class GeocodeRequest(BaseModel):
    address: str

class ReverseGeocodeRequest(BaseModel):
    latlng: str # e.g., "lat,lng"

class DirectionsRequest(BaseModel):
    origin: str
    destination: str
    mode: Optional[str] = 'driving'

class DistanceMatrixRequest(BaseModel):
    origins: str
    destinations: str
    mode: Optional[str] = 'driving'

class ElevationRequest(BaseModel):
    locations: str

class SmartSearchRequest(BaseModel):
    query: str
    # Optional: user's current location can be passed for more context
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
