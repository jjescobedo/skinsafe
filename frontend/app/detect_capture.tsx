import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Pressable, Image, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';

export default function DetectCapture() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
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
        navigateToReport(croppedPhoto.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  }

  async function cropImageToSquare(photo) {
    const maxWidth = photo.width;
    const cropSize = maxWidth; 
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri, width, height } = result.assets[0];
      if (width !== height) {
        try {
          const croppedPhoto = await cropImageToSquare({ uri, width, height });
          navigateToReport(croppedPhoto.uri);
        } catch (error) {
          console.error("Error cropping image:", error);
          Alert.alert("Error", "The image could not be cropped automatically. Please recrop the image.");
        }
      } else {
        navigateToReport(uri);
      }
    }
  }

  function onCameraReady() {
    setIsCameraReady(true);
  }

  function navigateToReport(photoUri) {
    router.push({
      pathname: '/detect_report',
      params: { photoUri },
    });
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.push('/detect')}>
        <Image source={require('../assets/back.png')} style={styles.backButtonImage} />
        <View style={styles.backButtonCircle} />
      </Pressable>
      
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={ref => setCameraRef(ref)}
        onCameraReady={onCameraReady}
      >
        <View style={styles.topContainer}>
          <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
            <Image source={require('../assets/flip.png')} style={styles.flipButtonImage} />
            <View style={styles.flipButtonCircle} />
          </Pressable>
        </View>
        <View style={styles.bottomContainer}>
          <Pressable style={styles.captureButton} onPress={takePicture}>
            <Image source={require('../assets/capture.png')} style={styles.captureButtonImage} />
          </Pressable>
          <Pressable style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.text}>Upload</Text>
          </Pressable>
        </View>
        <View style={styles.overlay}>
          <View style={styles.circle} />
        </View>
      </CameraView>
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
    borderRadius: 100,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  captureButtonImage: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 14,
    left: 15,
  },
  uploadButton: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonImage: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 4,
  },
  flipButtonImage: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 4,
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
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'dotted',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 3,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  flipButton: {
    position: 'absolute',
    top: -8,
    right: 20,
    zIndex: 3,
  },
  flipButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
  },
});