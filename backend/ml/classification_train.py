import numpy as np
import pandas as pd
import h5py
from sklearn.model_selection import train_test_split
from PIL import Image
import io
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.activations import gelu

# Read metadata
metadata = pd.read_csv('cac-2024/ml/data/train-metadata.csv')

# Sample 500 malignant and 5500 benign images
malignant_samples = metadata[metadata['target'] == 1].sample(350)
benign_samples = metadata[metadata['target'] == 0].sample(5500, random_state=42)

# Combine samples
sampled_metadata = pd.concat([malignant_samples, benign_samples])

# Load images from HDF5 file
with h5py.File('cac-2024/ml/data/train-image.hdf5', 'r') as hdf:
    images = []
    targets = []
    for index, row in sampled_metadata.iterrows():
        isic_id = row['isic_id']
        image_data = hdf[isic_id][()]
        image = Image.open(io.BytesIO(image_data))
        image = image.resize((224, 224))

        images.append(image)

        target = row['target']

        targets.append(row['target'])

images = np.array(images)
targets = np.array(targets)

# Split into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(images, targets, test_size=0.2, random_state=42)

# Create data generators
train_datagen = ImageDataGenerator(rescale=1./255)
val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow(X_train, y_train, batch_size=32)
validation_generator = val_datagen.flow(X_val, y_val, batch_size=32)

# Load pre-trained ResNet50 model + higher level layers
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Add custom layers on top of ResNet50
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(512, activation=gelu)(x)
predictions = Dense(1, activation='sigmoid')(x)

# Define the model
recognition_model = Model(inputs=base_model.input, outputs=predictions)

# Compile the model
recognition_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
recognition_model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=10
)

# Save the model
recognition_model.save('cac-2024/ml/data/recognition_model.keras')