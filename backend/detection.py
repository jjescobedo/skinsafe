from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io

app = FastAPI()

# Load your Keras model
model = load_model('ml/recognition_model.keras')

def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess the image to the format required by the model.
    """
    # Resize the image to the input size expected by the model
    image = image.resize((224, 224))  # Change this to your model's input size
    # Convert the image to an array
    image = img_to_array(image)
    # Normalize the image
    image = image / 255.0
    # Expand dimensions to match the model's input shape
    image = np.expand_dims(image, axis=0)
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint to handle image uploads and return model predictions.
    """
    try:
        # Read the image file
        image_data = await file.read()
        # Open the image
        image = Image.open(io.BytesIO(image_data))
        # Preprocess the image
        processed_image = preprocess_image(image)
        # Run the image through the model
        prediction = model.predict(processed_image)
        # Return the prediction as a JSON response
        return JSONResponse(content={"prediction": prediction.tolist()})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)