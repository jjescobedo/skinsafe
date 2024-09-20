import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function DetectLive() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonLeft} onPress={() => router.back()}>
                <Text style={styles.buttonTextLeft}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={() => router.push('/detect_capture')}>
                <Text style={styles.buttonTextRight}>Detect</Text>
            </TouchableOpacity>
            <View style={styles.topContainer}>
                <Text style={styles.title}>Skin Lesion Classification</Text>
                <Text style={styles.body}>
                    Our classifier uses a ResNet convolutional neural network to analyze and distinguish between malignant and benign skin lesions. 
                    Trained on a dataset of nearly 6,000 images, the classifier provides a quick, AI-powered assessment of skin lesions.
                </Text>
                <Text style={styles.body}>
                    When using the detector, make sure to place the lesion you want to evaluate within the guideline circle for the best results.
                    Here are some example photos that would receive an accurate evaluation:
                </Text>
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/example_1.jpg')} style={styles.image} />
                    <Image source={require('../assets/example_2.jpg')} style={styles.image} />
                </View>
                <Text style={styles.body}>
                    Disclaimer: This tool is not a substitute for professional medical advice, but instead an overly-conservative early warning system to soothe or corroborate any worries you may have. 
                    If you're concerned about a lesion, consult a licensed physician for a thorough examination and diagnosis.
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
        fontSize: 15,
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