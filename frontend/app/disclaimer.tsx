import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Disclaimer() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => router.push('/')}>
                <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            <View style={styles.sContainer}>
                <Text style={styles.title}>Disclaimer</Text>
                <Text style={styles.content}>
                    The information provided on this app is for general informational purposes only. All information on the app is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the app.
                </Text>
                <Text style={styles.content}>
                    Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the app or reliance on any information provided on the app. Your use of the app and your reliance on any information on the app is solely at your own risk.
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: -8,
    marginLeft: 30,
  },
  content: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
    marginLeft: 30,
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
