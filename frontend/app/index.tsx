import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Animated } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const [language, setLanguage] = useState('en'); // Default language is English

  const welcomeAnim = useRef(new Animated.Value(300)).current; 
  const skinSafeAnim = useRef(new Animated.Value(300)).current; 

  useEffect(() => {
    const getLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    };

    getLanguage();

    Animated.sequence([
      Animated.timing(welcomeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(skinSafeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.Text style={[styles.header2, { transform: [{ translateX: welcomeAnim }] }]}>
          {language === 'en' ? 'Welcome to' : 'Bienvenido a'}
        </Animated.Text>
        <Animated.Text style={[styles.header, { transform: [{ translateX: skinSafeAnim }] }]}>
          SkinSafe
        </Animated.Text>
        <Text style={styles.intro}>
          {language === 'en' ? 
            'Welcome to our comprehensive skin-cancer protection application. This app provides tools to help you monitor and protect your skin health.' : 
            'Bienvenido a nuestra aplicación integral de protección contra el cáncer de piel. Esta aplicación proporciona herramientas para ayudarle a monitorear y proteger la salud de su piel.'
          }
        </Text>
        <Text style={styles.features}>
          {language === 'en' ? 
            'Our key features include a skin lesion classifier as well as a live UV index based on your location with protections based on the UV score.' : 
            'Nuestras características clave incluyen un clasificador de lesiones cutáneas, así como un índice UV en vivo basado en su ubicación con protecciones basadas en el puntaje UV.'
          }
        </Text>
        <View style={styles.buttonContainer}>
          <View style={styles.topButtons}>
            <Pressable style={styles.button} onPress={() => router.push('/detect')}>
              <Text style={styles.buttonText}>{language === 'en' ? 'Detection' : 'Detección'}</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => router.push('/weather')}>
              <Text style={styles.buttonText}>{language === 'en' ? 'Weather' : 'Clima'}</Text>
            </Pressable>
          </View>
          <Pressable style={styles.button} onPress={() => router.push('/disclaimer')}>
            <Text style={styles.buttonText}>{language === 'en' ? 'Disclaimer' : 'Descargo de responsabilidad'}</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.languageContainer}>
        <Pressable 
          style={[styles.languageButton, language === 'en' && styles.selectedLanguageButton]} 
          onPress={() => handleLanguageChange('en')}
        >
          <Text style={styles.languageButtonText}>English</Text>
        </Pressable>
        <Pressable 
          style={[styles.languageButton, language === 'es' && styles.selectedLanguageButton]} 
          onPress={() => handleLanguageChange('es')}
        >
          <Text style={styles.languageButtonText}>Español</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  header2: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  intro: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  features: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  languageButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 10,
  },
  selectedLanguageButton: {
    backgroundColor: '#d3d3d3',
  },
  languageButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});