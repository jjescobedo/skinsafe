import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Detect() {
    const router = useRouter();
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

    const handleBackPress = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.buttonLeft} onPress={handleBackPress}>
                <Text style={styles.buttonTextLeft}>{language === 'en' ? 'Back' : 'Atrás'}</Text>
            </Pressable>
            <Pressable style={styles.buttonRight} onPress={() => router.push('/detect_capture')}>
                <Text style={styles.buttonTextRight}>{language === 'en' ? 'Detect' : 'Detectar'}</Text>
            </Pressable>
            <View style={styles.topContainer}>
                <Text style={styles.title}>{language === 'en' ? 'Skin Lesion Classification' : 'Clasificación de Lesiones Cutáneas'}</Text>
                <Text style={styles.body}>
                    {language === 'en' ? 
                        'Our classifier uses a ResNet convolutional neural network to analyze and distinguish between malignant and benign skin lesions. Trained on a dataset of nearly 6,000 images, the classifier provides a quick, AI-powered assessment of skin lesions.' : 
                        'Nuestro clasificador utiliza una red neuronal convolucional ResNet para analizar y distinguir entre lesiones cutáneas malignas y benignas. Entrenado en un conjunto de datos de casi 6,000 imágenes, el clasificador proporciona una evaluación rápida y potenciada por IA de las lesiones cutáneas.'
                    }
                </Text>
                <Text style={styles.body}>
                    {language === 'en' ? 
                        'When using the detector, make sure to place the lesion you want to evaluate within the guideline circle for the best results. Here are some example photos that would receive an accurate evaluation:' : 
                        'Al usar el detector, asegúrese de colocar la lesión que desea evaluar dentro del círculo de guía para obtener los mejores resultados. Aquí hay algunas fotos de ejemplo que recibirían una evaluación precisa:'
                    }
                </Text>
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/example_1.jpg')} style={styles.image} />
                    <Image source={require('../assets/example_2.jpg')} style={styles.image} />
                </View>
                <Text style={styles.body}>
                    {language === 'en' ? 
                        'Disclaimer: This tool is not a substitute for professional medical advice, but instead an overly-conservative early warning system to soothe or corroborate any worries you may have. If you\'re concerned about a lesion, consult a licensed physician for a thorough examination and diagnosis.' : 
                        'Descargo de responsabilidad: Esta herramienta no es un sustituto del consejo médico profesional, sino un sistema de advertencia temprana excesivamente conservador para calmar o corroborar cualquier preocupación que pueda tener. Si le preocupa una lesión, consulte a un médico autorizado para un examen y diagnóstico exhaustivos.'
                    }
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 16,
    },
    body: {
        fontSize: 13,
        color: 'gray',
        marginBottom: 16,
    },
    image: {
        width: 50,
        height: 'auto',
        padding: 70,
        borderRadius: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 10,
    },
    topContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        padding: 20,
        margin: 20,
        flexDirection: 'column',
        position: 'absolute',
        top: 50, 
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        zIndex: 1, 
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    buttonLeft: {
        position: 'absolute',
        top: 14,
        left: 20,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        zIndex: 2,
    },
    buttonRight: {
        position: 'absolute',
        top: 14,
        right: 20,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        zIndex: 2,
    },
    buttonTextLeft: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextRight: {
        color: 'green',
        fontSize: 16,
        fontWeight: 'bold',
    },
});