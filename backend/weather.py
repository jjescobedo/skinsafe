import requests
from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=env_path)

app = FastAPI()
router = APIRouter()

API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/3.0/onecall?"

if not API_KEY:
    logger.error("API key for OpenWeatherMap is not set. Please check your .env file.")
    raise ValueError("API key for OpenWeatherMap is not set. Please check your .env file.")
else:
    logger.info(f"API key loaded: {API_KEY}")

def get_weather_data(lat: float, lon: float) -> dict:
    """
    Fetch the weather data for the given latitude and longitude.
    """
    params = {
        "lat": lat,
        "lon": lon,
        "appid": API_KEY,
        "units": "imperial"  # Use metric units for temperature in Celsius
    }
    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching weather data: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {e}")

def calculate_skin_cancer_risk(uv_index: float) -> str:
    """
    Calculate the skin cancer risk based on the UV index.
    """
    if uv_index < 3:
        return "Low"
    elif 3 <= uv_index < 6:
        return "Moderate"
    elif 6 <= uv_index < 8:
        return "High"
    elif 8 <= uv_index < 11:
        return "Very High"
    else:
        return "Extreme"

@router.get("/weather")
def get_weather(lat: float, lon: float):
    """
    Endpoint to get weather information and calculate skin cancer risk.
    """
    try:
        weather_data = get_weather_data(lat, lon)
        uv_index = weather_data["current"]["uvi"]
        risk = calculate_skin_cancer_risk(uv_index)
        temperature = weather_data["current"]["temp"]
        forecast = weather_data["current"]["weather"][0]["main"]

        return {
            "uv_index": uv_index,
            "skin_cancer_risk": risk,
            "temperature": temperature,
            "forecast": forecast
        }
    except HTTPException as e:
        logger.error(f"HTTPException: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Internal server error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

app.include_router(router)