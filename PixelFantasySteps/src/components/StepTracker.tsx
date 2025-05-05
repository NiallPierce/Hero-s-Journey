import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievements } from './Achievements';
import { CharacterLevel } from './CharacterLevel';
import { DailyQuests } from './DailyQuests';
import { CharacterCustomization } from './CharacterCustomization';
import { CharacterAppearance } from './CharacterAppearance';
import { CombatSystem } from './CombatSystem';
import { ShopSystem } from './ShopSystem';
import InventorySystem from './InventorySystem';

interface StepData {
  steps: number;
  lastUpdated: string;
}

interface PedometerResult {
  steps: number;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'consumable' | 'equipment' | 'ability';
  effect: {
    type: 'health' | 'attack' | 'defense' | 'energy';
    value: number;
  };
  image: string;
}

interface PlayerStats {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  energy: number;
}

export const StepTracker: React.FC = () => {
  const [steps, setSteps] = useState<number>(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean>(false);
  const [isPedometerRunning, setIsPedometerRunning] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(1);
  const [levelProgress, setLevelProgress] = useState<number>(0);
  const [characterClass, setCharacterClass] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    energy: 0
  });

  // Calculate steps needed for next level (1000 steps per level)
  const stepsToNextLevel = 1000 - (steps % 1000);

  useEffect(() => {
    const checkPedometerAvailability = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);
    };

    const loadSavedData = async () => {
      try {
        // Load steps
        const savedStepData = await AsyncStorage.getItem('stepData');
        if (savedStepData) {
          const { steps: savedSteps } = JSON.parse(savedStepData) as StepData;
          setSteps(savedSteps);
          // Calculate level based on steps
          const calculatedLevel = Math.floor(savedSteps / 1000) + 1;
          setLevel(calculatedLevel);
          setLevelProgress((savedSteps % 1000) / 10); // Progress as percentage
        }

        // Load character class
        const savedCharacterData = await AsyncStorage.getItem('characterData');
        if (savedCharacterData) {
          const { class: savedClass } = JSON.parse(savedCharacterData);
          setCharacterClass(savedClass);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    checkPedometerAvailability();
    loadSavedData();
  }, []);

  useEffect(() => {
    let subscription: any;

    const subscribeToPedometer = async () => {
      if (isPedometerAvailable && isPedometerRunning) {
        subscription = await Pedometer.watchStepCount((result: PedometerResult) => {
          setSteps((prevSteps: number) => {
            const newSteps = prevSteps + result.steps;
            // Calculate new level and progress
            const newLevel = Math.floor(newSteps / 1000) + 1;
            const newProgress = (newSteps % 1000) / 10;

            // Update level if changed
            if (newLevel !== level) {
              setLevel(newLevel);
            }
            setLevelProgress(newProgress);

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
  }, [isPedometerAvailable, isPedometerRunning, level]);

  const togglePedometer = () => {
    setIsPedometerRunning(!isPedometerRunning);
  };

  const handleRewardEarned = (reward: { steps: number; experience: number; type: string; message: string }) => {
    setSteps((prevSteps: number) => {
      const newSteps = prevSteps + reward.steps;
      // Calculate new level and progress
      const newLevel = Math.floor(newSteps / 1000) + 1;
      const newProgress = (newSteps % 1000) / 10;

      // Update level if changed
      if (newLevel !== level) {
        setLevel(newLevel);
      }
      setLevelProgress(newProgress);

      // Save to AsyncStorage
      AsyncStorage.setItem('stepData', JSON.stringify({
        steps: newSteps,
        lastUpdated: new Date().toISOString()
      }));
      return newSteps;
    });
  };

  const handlePurchase = (item: ShopItem) => {
    if (steps >= item.cost) {
      setSteps((prevSteps: number) => {
        const newSteps = prevSteps - item.cost;
        // Save to AsyncStorage
        AsyncStorage.setItem('stepData', JSON.stringify({
          steps: newSteps,
          lastUpdated: new Date().toISOString()
        }));
        return newSteps;
      });

      // Apply item effects
      setPlayerStats((prevStats: PlayerStats) => {
        const newStats = { ...prevStats };
        switch (item.effect.type) {
          case 'health':
            newStats.health = Math.min(prevStats.maxHealth, prevStats.health + item.effect.value);
            break;
          case 'attack':
            newStats.attack += item.effect.value;
            break;
          case 'defense':
            newStats.defense += item.effect.value;
            break;
          case 'energy':
            newStats.energy += item.effect.value;
            break;
        }
        return newStats;
      });
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pixel Fantasy Steps</Text>
          <Text style={styles.subtitle}>Level {level} {characterClass ? `- ${characterClass}` : ''}</Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Steps: {steps}</Text>
          <Text style={styles.statsText}>Steps to Next Level: {stepsToNextLevel}</Text>
          <Text style={styles.statsText}>Progress: {levelProgress.toFixed(1)}%</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isPedometerRunning ? styles.buttonActive : null]}
          onPress={togglePedometer}
        >
          <Text style={styles.buttonText}>
            {isPedometerRunning ? 'Stop Tracking' : 'Start Tracking'}
          </Text>
        </TouchableOpacity>

        <CharacterLevel currentSteps={steps} />
        <DailyQuests currentSteps={steps} />
        <Achievements currentSteps={steps} />
        <CharacterCustomization 
          level={level}
          onClassSelect={setCharacterClass}
        />
        <CharacterAppearance level={level} />
        <CombatSystem 
          currentSteps={steps}
          characterClass={characterClass || undefined}
          onRewardEarned={handleRewardEarned}
          playerStats={playerStats}
        />
        <ShopSystem 
          currentSteps={steps}
          onPurchase={handlePurchase}
          characterClass={characterClass || undefined}
        />
        <InventorySystem />
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonActive: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 