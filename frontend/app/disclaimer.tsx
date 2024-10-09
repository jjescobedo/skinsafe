import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Disclaimer() {
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

    return (
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.backButtonText}>{language === 'en' ? 'Back' : 'Atrás'}</Text>
            </Pressable>
            <View style={styles.sContainer}>
                <Text style={[language === 'en' ? styles.titleEn : styles.titleEs]}>{language === 'en' ? 'Disclaimer' : 'Descargo de responsabilidad'}</Text>
                <Text style={[language === 'en' ? styles.contentEn : styles.contentEs]}>
                    {language === 'en' ? 
                        'The information provided on this app is for general informational purposes only. All information on the app is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the app.' : 
                        'La información proporcionada en esta aplicación es solo para fines informativos generales. Toda la información en la aplicación se proporciona de buena fe, sin embargo, no hacemos ninguna representación o garantía de ningún tipo, expresa o implícita, con respecto a la precisión, adecuación, validez, fiabilidad, disponibilidad o integridad de cualquier información en la aplicación.'
                    }
                </Text>
                <Text style={[language === 'en' ? styles.contentEn : styles.contentEs]}>
                    {language === 'en' ? 
                        'Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the app or reliance on any information provided on the app. Your use of the app and your reliance on any information on the app is solely at your own risk.' : 
                        'Bajo ninguna circunstancia tendremos ninguna responsabilidad hacia usted por cualquier pérdida o daño de cualquier tipo incurrido como resultado del uso de la aplicación o la confianza en cualquier información proporcionada en la aplicación. Su uso de la aplicación y su confianza en cualquier información en la aplicación es únicamente bajo su propio riesgo.'
                    }
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  sContainer: {
    backgroundColor: 'white',
    height: 570,
    width: 336,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 6,
    flexDirection: 'column',
    justifyContent: 'space-between', 
  },
  titleEn: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
  },
  titleEs: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
  },
  contentEn: {
    fontSize: 16,
    marginBottom: 30,
    lineHeight: 24,
    marginLeft: 22,
    marginRight: 30,
  },
  contentEs: {
    fontSize: 14,
    marginBottom: 30,
    lineHeight: 24,
    marginLeft: 22,
    marginRight: 30,
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
    marginLeft: 6,
    marginTop: -10,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
