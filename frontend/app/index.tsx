import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Pressable, Animated } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const welcomeAnim = useRef(new Animated.Value(300)).current; 
  const skinSafeAnim = useRef(new Animated.Value(300)).current; 

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.Text style={[styles.header2, { transform: [{ translateX: welcomeAnim }] }]}>
          Welcome to
        </Animated.Text>
        <Animated.Text style={[styles.header, { transform: [{ translateX: skinSafeAnim }] }]}>
          SkinSafe
        </Animated.Text>
        <Text style={styles.intro}>
          Welcome to our comprehensive skin-cancer protection application. This app provides tools to help you monitor and protect your skin health.
        </Text>
        <Text style={styles.features}>
          Our key features include a skin lesion classifier as well as a live UV index based on your location with protections based on the UV score.
        </Text>
        <View style={styles.buttonContainer}>
          <View style={styles.topButtons}>
            <Pressable style={styles.button} onPress={() => router.push('/detect')}>
              <Text style={styles.buttonText}>Detection</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => router.push('/weather')}>
              <Text style={styles.buttonText}>Weather</Text>
            </Pressable>
          </View>
          <Pressable style={styles.button} onPress={() => router.push('/disclaimer')}>
            <Text style={styles.buttonText}>Disclaimer</Text>
          </Pressable>
        </View>
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
});