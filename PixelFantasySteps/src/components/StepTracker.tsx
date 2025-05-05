import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
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
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

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

  // Add simulation state
  const [simulatedSteps, setSimulatedSteps] = useState<number>(0);

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

  const simulateSteps = async () => {
    const newSteps = steps + 1000;
    setSteps(newSteps);
    setSimulatedSteps(prev => prev + 1000);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('stepData', JSON.stringify({
        steps: newSteps,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving simulated steps:', error);
    }
  };

  const resetProgress = async () => {
    try {
      // Reset steps and level
      setSteps(0);
      setLevel(1);
      setLevelProgress(0);
      setSimulatedSteps(0);
      
      // Clear AsyncStorage data
      await AsyncStorage.removeItem('stepData');
      await AsyncStorage.removeItem('characterData');
      
      // Reset character class and stats
      setCharacterClass(null);
      setPlayerStats({
        health: 100,
        maxHealth: 100,
        attack: 10,
        defense: 5,
        energy: 0
      });
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pixel Fantasy Steps</Text>
          <Text style={styles.subtitle}>Level {level} {characterClass ? `- ${characterClass}` : ''}</Text>
          <View style={styles.headerButtons}>
            {Platform.OS === 'web' && (
              <TouchableOpacity 
                style={styles.simulateButton} 
                onPress={simulateSteps}
              >
                <Text style={styles.simulateButtonText}>Simulate 1000 Steps</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={resetProgress}
            >
              <Text style={styles.resetButtonText}>Reset Progress</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.text.secondary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  statsText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    ...shadows.medium,
  },
  buttonActive: {
    backgroundColor: colors.status.success,
  },
  buttonText: {
    ...typography.subtitle,
    color: colors.text.primary,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  simulateButton: {
    backgroundColor: colors.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    ...shadows.medium,
  },
  simulateButtonText: {
    color: colors.text.primary,
    ...typography.subtitle,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  resetButton: {
    backgroundColor: colors.status.error,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    ...shadows.medium,
  },
  resetButtonText: {
    color: colors.text.primary,
    ...typography.subtitle,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 