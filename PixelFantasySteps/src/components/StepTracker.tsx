import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievements } from './Achievements';

interface StepData {
  steps: number;
  lastUpdated: string;
}

interface PedometerResult {
  steps: number;
}

export const StepTracker: React.FC = () => {
  const [steps, setSteps] = useState<number>(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean>(false);

  useEffect(() => {
    const checkPedometerAvailability = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);
    };

    const loadSavedSteps = async () => {
      try {
        const savedData = await AsyncStorage.getItem('stepData');
        if (savedData) {
          const { steps: savedSteps } = JSON.parse(savedData) as StepData;
          setSteps(savedSteps);
        }
      } catch (error) {
        console.error('Error loading saved steps:', error);
      }
    };

    checkPedometerAvailability();
    loadSavedSteps();
  }, []);

  useEffect(() => {
    let subscription: any;

    const subscribeToPedometer = async () => {
      if (isPedometerAvailable) {
        subscription = await Pedometer.watchStepCount((result: PedometerResult) => {
          setSteps((prevSteps: number) => {
            const newSteps = prevSteps + result.steps;
            // Save to AsyncStorage
            AsyncStorage.setItem('stepData', JSON.stringify({
              steps: newSteps,
              lastUpdated: new Date().toISOString()
            }));
            return newSteps;
          });
        });
      }
    };

    subscribeToPedometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isPedometerAvailable]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Fantasy Step Tracker</Text>
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsText}>
            Steps Today: {steps}
          </Text>
          {!isPedometerAvailable && (
            <Text style={styles.warningText}>
              Step counting is not available on this device
            </Text>
          )}
        </View>
        <Achievements currentSteps={steps} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  stepsContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  stepsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  warningText: {
    color: '#e74c3c',
    marginTop: 10,
  },
}); 