import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function Detect() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef && isCameraReady) {
      try {
        const options = { quality: 0.5, base64: true };
        const photo = await cameraRef.takePictureAsync(options);
        const croppedPhoto = await cropImageToSquare(photo);
        setPhotoUri(croppedPhoto.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  }

  async function cropImageToSquare(photo) {
    const maxWidth = photo.width;
    const cropSize = maxWidth; // Crop size should be the same as the maximum width
    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [
        {
          crop: {
            originX: 0,
            originY: (photo.height - cropSize) / 2,
            width: cropSize,
            height: cropSize,
          },
        },
      ],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return manipResult;
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.uri);
    }
  }

  function onCameraReady() {
    setIsCameraReady(true);
  }

  function discardPhoto() {
    setPhotoUri(null);
  }

  function evaluatePhoto() {
    // Placeholder function for future evaluation logic
    setPhotoUri(null);
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.container}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.discardButton} onPress={discardPhoto}>
              <Text style={styles.text}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.evaluateButton} onPress={evaluatePhoto}>
              <Text style={styles.text}>Evaluate</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={ref => setCameraRef(ref)}
          onCameraReady={onCameraReady}
        >
          <View style={styles.topContainer}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.text}>Upload</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.overlay}>
            <View style={styles.circle} />
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  topContainer: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  flipButton: {
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 2,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  discardButton: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  evaluateButton: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'dotted',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1, // Ensures the image is a square
    resizeMode: 'contain', // Ensures the image fits within the view with white space if necessary
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});