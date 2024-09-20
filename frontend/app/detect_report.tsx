import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function DetectReport() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState(null);

  useEffect(() => {
    if (photoUri) {
      evaluatePhoto(photoUri);
    }
  }, [photoUri]);

  async function evaluatePhoto(uri) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'photo.png',
        type: 'image/png',
      });

      const response = await fetch('https://cac-2024-api.onrender.com/detection/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      setPercentage(data.prediction);
    } catch (error) {
      console.error("Error evaluating photo:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.previewImage} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        percentage !== null && (
          <Text style={styles.percentageText}>
            {percentage < 0.50 ? 'Benign' : 'Malignant'}
          </Text>
        )
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => router.push('/detect')}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.evaluateMoreButton} onPress={() => router.push('/detect_capture')}>
          <Text style={styles.buttonText}>Evaluate More</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.discardButton} onPress={() => router.push('/detect_capture')}>
          <Text style={styles.buttonText}>Discard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  saveButton: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  evaluateMoreButton: {
    width: 150,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discardButton: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});