import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Animated, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');

  const welcomeAnim = useRef(new Animated.Value(300)).current; 
  const skinSafeAnim = useRef(new Animated.Value(300)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;  

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
    // Reset animation values
    welcomeAnim.setValue(300);
    skinSafeAnim.setValue(300);

    logoOpacity.setValue(0);

    // Start animation sequence
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
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [language]); // Add language as a dependency

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Pressable style={language === 'en' ? styles.buttonDisclaimerEn : styles.buttonDisclaimerEs} onPress={() => router.push('/disclaimer')}>
          <Text style={language === 'en' ? styles.buttonTextDisclaimerEn : styles.buttonTextDisclaimerEs}>{language === 'en' ? 'Disclaimer' : 'Descargo de responsabilidad'}</Text>
        </Pressable>
        <View style={language === 'en' ? styles.welcomeContainerEn : styles.welcomeContainerEs}>
          <Animated.Image 
            source={require('../assets/logo.png')} 
            style={[styles.logo, { opacity: logoOpacity }]} 
          />
          <Animated.Text style={[language === 'en' ? styles.header2En : styles.header2Es, { transform: [{ translateX: welcomeAnim }] }]}>
            {language === 'en' ? 'Welcome to' : 'Bienvenido a'}
          </Animated.Text>
          <Animated.Text style={[language === 'en' ? styles.headerEn : styles.headerEs, { transform: [{ translateX: skinSafeAnim }] }]}>
            SkinSafe
          </Animated.Text>
          <Text style={language === 'en' ? styles.introEn : styles.introEs}>
            {language === 'en' ? 
              'Welcome to our comprehensive skin-cancer protection application. This app provides tools to help you monitor and protect your skin health.' : 
              'Bienvenido a nuestra aplicación integral de protección contra el cáncer de piel. Esta aplicación proporciona herramientas para ayudarle a monitorear y proteger la salud de su piel.'
            }
          </Text>
        </View>
        <View style={language === 'en' ? styles.buttonContainerEn : styles.buttonContainerEs}>
          <View style={language === 'en' ? styles.topButtonsEn : styles.topButtonsEs}>
            <Pressable style={language === 'en' ? styles.buttonFeatureLeftEn : styles.buttonFeatureLeftEs} onPress={() => router.push('/detect')}>
              <Image source={require('../assets/detect_icon.png')} style={language === 'en' ? styles.buttonImageEs : styles.buttonImageEn} />
              <Text style={language === 'en' ? styles.buttonTextFeatureLeftEn : styles.buttonTextFeatureLeftEs}>{language === 'en' ? 'Detection' : 'Detección'}</Text>
            </Pressable>
            <Pressable style={language === 'en' ? styles.buttonFeatureRightEn : styles.buttonFeatureRightEs} onPress={() => router.push('/weather')}>
            <Image source={require('../assets/weather_icon.png')} style={language === 'en' ? styles.buttonImageEn : styles.buttonImageEs} />
              <Text style={language === 'en' ? styles.buttonTextFeatureRightEn : styles.buttonTextFeatureRightEs}>{language === 'en' ? 'Weather' : 'Clima'}</Text>
            </Pressable>
          </View>
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
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 20,
    left: 24,
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
  logo: {
    width: 100,
    height: 100,
    marginTop: -100,
    marginBottom: 20,
  },
  // English
  welcomeContainerEn: {
    backgroundColor: 'white',
    paddingTop: 130,
    paddingBottom: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 10,
    marginTop: -14,
    marginBottom: 0,
    alignItems: 'center',
  },
  headerEn: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  header2En: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  introEn: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    marginRight: -30,
    marginLeft: -30,
  },
  buttonContainerEn: {
    alignItems: 'center',
  },
  topButtonsEn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  buttonFeatureLeftEn: {
    backgroundColor: 'white',
    paddingVertical: 26,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 20,
    marginRight: -1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFeatureRightEn: {
    backgroundColor: 'white',
    paddingVertical: 26,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisclaimerEn: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 10,
  },
  buttonTextFeatureLeftEn: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
    marginHorizontal: 2,
  },
  buttonTextFeatureRightEn: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
  },
  buttonTextDisclaimerEn: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonImageEn: {
    width: 80,
    height: 80,
    margin: -10,
  },
  // Spanish
  welcomeContainerEs: {
    backgroundColor: 'white',
    paddingTop: 130,
    paddingBottom: 6,
    paddingHorizontal: 60,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 10,
    marginTop: -10,
    marginBottom: 0,
    alignItems: 'center',
  },
  headerEs: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  header2Es: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  introEs: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 14,
    marginRight: -30,
    marginLeft: -30,
  },
  buttonContainerEs: {
    alignItems: 'center',
  },
  topButtonsEs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  buttonFeatureLeftEs: {
    backgroundColor: 'white',
    paddingVertical: 26,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 20,
    marginRight: -1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFeatureRightEs: {
    backgroundColor: 'white',
    paddingVertical: 26,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisclaimerEs: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 10,
  },
  buttonTextFeatureLeftEs: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
  },
  buttonTextFeatureRightEs: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
    marginHorizontal: 14,
  },
  buttonTextDisclaimerEs: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonImageEs: {
    width: 80,
    height: 80,
    margin: -10,
  },
});