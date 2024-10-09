import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';

export default function Weather() {
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

  const [loading, setLoading] = useState(true);
  const [uvRating, setUvRating] = useState(0);
  const [uvRisk, setUvRisk] = useState('Low');
  const [temperature, setTemperature] = useState('0° F');
  const [weatherCondition, setWeatherCondition] = useState('Sunny');
  const [weatherIcon, setWeatherIcon] = useState('🌞');

  const weatherIcons = {
    'Sunny': '🌞',
    'Clear': '🌞',
    'Cloudy': '☁️',
    'Partly Cloudy': '⛅',
    'Windy': '🌬️',
    'Raining': '🌧️',
    'Snowing': '❄️',
    'Lightning': '⚡'
  };

  const weatherTranslations = {
    'Sunny': { en: 'Sunny', es: 'Soleado' },
    'Clear': { en: 'Clear', es: 'Despejado' },
    'Cloudy': { en: 'Cloudy', es: 'Nublado' },
    'Partly Cloudy': { en: 'Partly Cloudy', es: 'Parcialmente Nublado' },
    'Windy': { en: 'Windy', es: 'Ventoso' },
    'Raining': { en: 'Raining', es: 'Lluvioso' },
    'Snowing': { en: 'Snowing', es: 'Nevando' },
    'Lightning': { en: 'Lightning', es: 'Relámpago' }
  };

  const uvRiskTranslations = {
    'Low': { en: 'Low ', es: 'Bajo' },
    'Moderate': { en: 'Moderate', es: 'Moderado' },
    'Severe': { en: 'Severe', es: 'Severo' }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      try {
        const response = await fetch(`https://cac-2024.onrender.com/weather/weather?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        console.log(data);

        setUvRating(data.uv_index);
        setUvRisk(data.skin_cancer_risk);
        const roundedTemperature = Math.round(data.temperature);
        setTemperature(`${roundedTemperature}° F`);
        setWeatherCondition(data.forecast);
        setWeatherIcon(weatherIcons[data.forecast] || '🌞');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const weatherInfoRef = React.useRef(null);

  function shareWeather() {
    weatherInfoRef.current.capture().then(uri => {
      Sharing.shareAsync(uri).then(() => {
        console.log('Shared');
      });
    });
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  let uvRatingColor;
  if (uvRating <= 2) {
    uvRatingColor = 'green';
  } else if (uvRating <= 7) {
    uvRatingColor = 'orange';
  } else {
    uvRatingColor = 'red';
  }

  let protectionContent;
  if (uvRating <= 2) {
    protectionContent = (
      <View>
        <Text style={[styles.protTitle, { color: uvRatingColor }]}>
          {language === 'en' ? 'Low Skin Cancer Risk' : 'Bajo Riesgo de Cáncer de Piel'}
        </Text>
        <Text style={styles.protTextBody}>
          {language === 'en' ?
            'UV radiation from the sun can damage skin cell DNA, leading to mutations that increase the risk of skin cancer. Protecting your skin with sunscreen, clothing, and shade helps reduce this risk.' :
            'La radiación UV del sol puede dañar el ADN de las células de la piel, lo que lleva a mutaciones que aumentan el riesgo de cáncer de piel. Proteger su piel con protector solar, ropa y sombra ayuda a reducir este riesgo.'
          }
        </Text>
        <FlatList
          data={[
            { key: language === 'en' ? 'No protection needed. You can safely stay outside!' : 'No se necesita protección. ¡Puedes quedarte afuera de manera segura!' },
          ]}
          renderItem={({ item }) => <Text style={styles.protTextList}>{item.key}</Text>}
        />
      </View>
    );
  } else if (uvRating <= 7) {
    protectionContent = (
      <View>
        <Text style={[styles.protTitle, { color: uvRatingColor }]}>
          {language === 'en' ? 'Moderate Skin Cancer Risk' : 'Riesgo Moderado de Cáncer de Piel'}
        </Text>
        <Text style={styles.protTextBody}>
          {language === 'en' ?
            'UV radiation from the sun can damage skin cell DNA, leading to mutations that increase the risk of skin cancer. Protecting your skin with sunscreen, clothing, and shade helps reduce this risk.' :
            'La radiación UV del sol puede dañar el ADN de las células de la piel, lo que lleva a mutaciones que aumentan el riesgo de cáncer de piel. Proteger su piel con protector solar, ropa y sombra ayuda a reducir este riesgo.'
          }
        </Text>
        <FlatList
          data={[
            { key: language === 'en' ? 'Wear sunglasses and use SPF 30+ sunscreen.' : 'Use gafas de sol y protector solar SPF 30+.' },
            { key: language === 'en' ? 'Seek shade during midday hours.' : 'Busque sombra durante las horas del mediodía.' },
          ]}
          renderItem={({ item }) => <Text style={styles.protTextList}>{item.key}</Text>}
        />
      </View>
    );
  } else {
    protectionContent = (
      <View>
        <Text style={[styles.protTitle, { color: uvRatingColor }]}>
          {language === 'en' ? 'Severe Skin Cancer Risk' : 'Riesgo Severo de Cáncer de Piel'}
        </Text>
        <Text style={styles.protTextBody}>
          {language === 'en' ?
            'UV radiation from the sun can damage skin cell DNA, leading to mutations that increase the risk of skin cancer. Protecting your skin with sunscreen, clothing, and shade helps reduce this risk.' :
            'La radiación UV del sol puede dañar el ADN de las células de la piel, lo que lleva a mutaciones que aumentan el riesgo de cáncer de piel. Proteger su piel con protector solar, ropa y sombra ayuda a reducir este riesgo.'
          }
        </Text>
        <FlatList
          data={[
            { key: language === 'en' ? 'Wear sunglasses and use SPF 30+ sunscreen.' : 'Use gafas de sol y protector solar SPF 30+.' },
            { key: language === 'en' ? 'Avoid being outside during midday hours.' : 'Evite estar afuera durante las horas del mediodía.' },
            { key: language === 'en' ? 'Seek shade during midday hours.' : 'Busque sombra durante las horas del mediodía.' },
          ]}
          renderItem={({ item }) => <Text style={styles.protTextList}>{item.key}</Text>}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>{language === 'en' ? 'Back' : 'Atrás'}</Text>
      </Pressable>
      <ViewShot ref={weatherInfoRef}>

        <View style={styles.uvweathContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.weatherTitle}>{language === 'en' ? 'Weather' : 'Clima'}</Text>
            <View style={styles.currentWeather}>
              <Text style={styles.weatherIcon}>{weatherIcon}</Text>
              <Text style={styles.condition}>{weatherTranslations[weatherCondition][language]}</Text>
              <Text style={styles.temperature}>{temperature}</Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.uvTitle}>{language === 'en' ? 'UV Rating' : 'Índice UV'}</Text>
            <Text style={[styles.uvRating, { color: uvRatingColor }]}>{uvRating}</Text>
            <Text style={styles.uvRisk}>{uvRiskTranslations[uvRisk][language]}</Text>
          </View>

        </View>
        <View style={styles.protContainer}>
          {protectionContent}
        </View>
      </ViewShot>
      <Pressable style={styles.shareButton} onPress={shareWeather}>
        <Text style={styles.shareButtonText}>{language === 'en' ? 'Share' : 'Compartir'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  backButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 10,
    marginLeft: 20,
    marginTop: -24,
    marginBottom: -4,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uvweathContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 30,
  },
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 30,
  },

  // Weather
  weatherTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  currentWeather: {
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherIcon: {
    fontSize: 80,
    marginTop: -10,
  },
  condition: {
    fontSize: 18,
    color: 'gray',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: -10,
  },

  // UV
  uvTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 1,
  },
  uvRating: {
    fontSize: 68,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
  },
  uvRisk: {
    fontSize: 18,
    color: 'gray',
    marginTop: -6,
  },

  // Protection
  protContainer: {
    backgroundColor: 'white',
    width: 350,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    padding: 20,
  },
  protTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  protTextBody: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  protTextList: {
    fontSize: 18,
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 260,
    marginRight: 20,
    marginTop: 20,
  },
  shareButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
