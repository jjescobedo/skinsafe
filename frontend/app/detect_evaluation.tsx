import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetectReport() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState(null);
  const [language, setLanguage] = useState('en'); // Default language is English

  useEffect(() => {
    const getLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    };

    getLanguage();
  }, []);

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

      const response = await fetch('https://cac-2024.onrender.com/detection/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      console.log(data);
      setPercentage(data.prediction);
    } catch (error) {
      console.error("Error evaluating photo:", error);
    } finally {
      setLoading(false);
    }
  }

  function getDiagnosisText(percentage) {
    percentage = percentage * 10;
    if (percentage < 0.25) {
      return language === 'en' ? 'Benign' : 'Benigno';
    } else if (percentage >= 0.35 && percentage < 0.45) {
      return language === 'en' ? 'Likely Benign' : 'Probablemente Benigno';
    } else if (percentage >= 0.45 && percentage < 0.75) {
      return language === 'en' ? 'Inconclusive' : 'Inconcluso';
    } else if (percentage >= 0.75 && percentage < 0.85) {
      return language === 'en' ? 'Likely Malignant' : 'Probablemente Maligno';
    } else {
      return language === 'en' ? 'Malignant' : 'Maligno';
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
            {getDiagnosisText(percentage)}
          </Text>
        )
      )}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.saveButton} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>{language === 'en' ? 'Save' : 'Guardar'}</Text>
        </Pressable>
        <Pressable style={styles.discardButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>{language === 'en' ? 'Discard' : 'Descartar'}</Text>
        </Pressable>
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
    margin: 20,
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