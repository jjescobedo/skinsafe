import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, Pressable, Image, Alert, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetectCapture() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const getLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    };

    getLanguage();
  }, []);

  const handleBackPress = () => {
    router.back(); 
  };

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const squareSize = 200;
  const squareX = (screenWidth - squareSize) / 2;
  const squareY = (screenHeight - squareSize) / 2;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {language === 'en' ? 'We need your permission to show the camera' : 'Necesitamos su permiso para mostrar la cámara'}
        </Text>
        <Button onPress={requestPermission} title={language === 'en' ? 'Grant Permission' : 'Conceder Permiso'} />
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
    const { width, height } = photo;
    const scaleX = width / screenWidth;
    const scaleY = height / screenHeight;

    const cropX = squareX * scaleX;
    const cropY = squareY * scaleY;
    const cropWidth = squareSize * scaleX;
    const cropHeight = squareSize * scaleY;

    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [
        {
          crop: {
            originX: cropX,
            originY: cropY,
            width: cropWidth,
            height: cropHeight,
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
          Alert.alert(language === 'en' ? 'Error' : 'Error', language === 'en' ? 'The image could not be cropped automatically. Please recrop the image.' : 'La imagen no se pudo recortar automáticamente. Por favor, recorte la imagen nuevamente.');
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
      pathname: '/detect_evaluation',
      params: { photoUri },
    });
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleBackPress}>
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
            <Text style={styles.text}>{language === 'en' ? 'Upload' : 'Subir'}</Text>
          </Pressable>
        </View>
        <View style={styles.overlay}>
          <View style={styles.circle} />
          <View style={styles.square} />
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
    width: 70,
    height: 70,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'dotted',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  square: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'dotted',
    backgroundColor: 'transparent',
    position: 'absolute',
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
