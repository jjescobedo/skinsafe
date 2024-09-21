from fastapi import FastAPI, APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io

app = FastAPI()
router = APIRouter()

model = load_model('ml/recognition_model.keras')

def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess the image to the format required by the model.
    """
    image = image.convert("RGB")  # Convert image to RGB
    image = image.resize((224, 224))
    image = img_to_array(image)
    image = image / 255.0
    image = np.expand_dims(image, axis=0)
    return image

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint to handle image uploads and return model predictions.
    """
    try:
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        processed_image = preprocess_image(image)
        prediction = model.predict(processed_image)
        return JSONResponse(content={"prediction": prediction.tolist()})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

app.include_router(router)