import uvicorn
from fastapi import FastAPI
from detection import app as detection_app
from weather import app as weather_app

app = FastAPI()

# Include the detection and weather routers
app.include_router(detection_app.router, prefix="/detection")
app.include_router(weather_app.router, prefix="/weather")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)