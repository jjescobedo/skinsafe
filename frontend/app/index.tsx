import React, { useEffect } from 'react';
import { Text, View, Button, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as Location from 'expo-location';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => router.push('/detect')}>
          <Text style={styles.buttonText}>Detection</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push('/weather')}>
          <Text style={styles.buttonText}>Weather</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push('/disclaimer')}>
          <Text style={styles.buttonText}>Disclaimer</Text>
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
  },
  buttonContainer: {
    flex: 1,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    
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
    marginLeft: 4,
    marginRight: 4,
    marginTop: -34,
    marginBottom: -4,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
