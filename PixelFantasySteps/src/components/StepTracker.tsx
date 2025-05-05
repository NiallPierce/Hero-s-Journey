import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gameService } from '../services/api';
import { UserProfile, StepUpdateResponse } from '../types/api';
import { Achievements } from './Achievements';
import { CharacterLevel } from './CharacterLevel';
import { DailyQuests } from './DailyQuests';
import { CharacterCustomization } from './CharacterCustomization';
import { CharacterAppearance } from './CharacterAppearance';
import { CombatSystem } from './CombatSystem';
import { ShopSystem } from './ShopSystem';
import InventorySystem from './InventorySystem';
import { RewardSystem } from './RewardSystem';
import { colors } from '../styles/theme';

interface PedometerResult {
  steps: number;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats: {
    health: number;
    attack: number;
    defense: number;
    energy: number;
  };
}

interface PlayerStats {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  energy: number;
}

const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    color: colors.text.primary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.card,
  },
};

export const StepTracker: React.FC = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean>(false);
  const [pastStepCount, setPastStepCount] = useState<number>(0);
  const [currentStepCount, setCurrentStepCount] = useState<number>(0);
  const [isPedometerActive, setIsPedometerActive] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [experience, setExperience] = useState<number>(0);
  const [playerStats, setPlayerStats] = useState<UserProfile['character']['stats']>({
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    energy: 100,
  });
  const [levelProgress, setLevelProgress] = useState<number>(0);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [showShop, setShowShop] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [characterClass, setCharacterClass] = useState<string>('Warrior');

  useEffect(() => {
    checkPedometer();
    loadSavedData();
  }, []);

  const checkPedometer = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(isAvailable);
  };

  const loadSavedData = async () => {
    try {
      const savedSteps = await AsyncStorage.getItem('steps');
      const savedLevel = await AsyncStorage.getItem('level');
      const savedExperience = await AsyncStorage.getItem('experience');
      const savedStats = await AsyncStorage.getItem('playerStats');

      if (savedSteps) setSteps(parseInt(savedSteps));
      if (savedLevel) setLevel(parseInt(savedLevel));
      if (savedExperience) setExperience(parseInt(savedExperience));
      if (savedStats) setPlayerStats(JSON.parse(savedStats));

      // Load steps from API
      const { data: profileData } = await gameService.getProfile();
      if (profileData) {
        setSteps(profileData.steps.total);
        setLevel(profileData.character.level);
        setExperience(profileData.character.experience);
        setPlayerStats(profileData.character.stats);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('steps', steps.toString());
      await AsyncStorage.setItem('level', level.toString());
      await AsyncStorage.setItem('experience', experience.toString());
      await AsyncStorage.setItem('playerStats', JSON.stringify(playerStats));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const subscribe = async () => {
    if (!isPedometerAvailable) return;

    const subscription = Pedometer.watchStepCount((result: PedometerResult) => {
      setCurrentStepCount(result.steps);
    });

    setIsPedometerActive(true);
    return subscription;
  };

  const unsubscribe = async (subscription: any) => {
    if (subscription) {
      subscription.remove();
      setIsPedometerActive(false);
    }
  };

  const handleStartTracking = async () => {
    if (!isPedometerAvailable) return;

    const subscription = await subscribe();
    if (subscription) {
      setPastStepCount(currentStepCount);
    }
  };

  const handleStopTracking = async () => {
    if (!isPedometerAvailable) return;

    const subscription = await subscribe();
    if (subscription) {
      const newSteps = steps + (currentStepCount - pastStepCount);
      setSteps(newSteps);
      setPastStepCount(0);
      setCurrentStepCount(0);
      await unsubscribe(subscription);
      await saveData();

      // Update steps in the API
      try {
        const { data } = await gameService.updateSteps(newSteps);
        if (data) {
          setLevel(data.character.level);
          setExperience(data.character.experience);
          setPlayerStats(data.character.stats);
        }
      } catch (error) {
        console.error('Error updating steps:', error);
      }
    }
  };

  const calculateLevelProgress = () => {
    const baseExp = 100;
    const expNeeded = baseExp * Math.pow(1.5, level - 1);
    return (experience / expNeeded) * 100;
  };

  useEffect(() => {
    setLevelProgress(calculateLevelProgress());
  }, [experience, level]);

  const stepsToNextLevel = () => {
    const baseExp = 100;
    const expNeeded = baseExp * Math.pow(1.5, level - 1);
    const stepsPerExp = 10;
    return Math.ceil((expNeeded - experience) * stepsPerExp);
  };

  const handleRewardEarned = (reward: { steps: number; experience: number; type: string; message: string }) => {
    setSteps(prevSteps => prevSteps + reward.steps);
    setExperience(prevExp => prevExp + reward.experience);
    
    // Save to AsyncStorage
    saveData();
  };

  return (
    <ScrollView style={styles.container}>
      <RewardSystem 
        onRewardEarned={handleRewardEarned}
        characterClass={characterClass}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Step Tracker</Text>
        <Text style={styles.subtitle}>Level {level}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Steps</Text>
          <Text style={styles.statValue}>{steps}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Experience</Text>
          <Text style={styles.statValue}>{experience}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Steps to Next Level</Text>
          <Text style={styles.statValue}>{stepsToNextLevel()}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Level Progress</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${levelProgress}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{Math.round(levelProgress)}%</Text>
      </View>

      <CharacterLevel currentSteps={steps} />

      <DailyQuests currentSteps={steps} />

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Health</Text>
          <Text style={styles.statValue}>{playerStats.health}/{playerStats.maxHealth}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Attack</Text>
          <Text style={styles.statValue}>{playerStats.attack}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Defense</Text>
          <Text style={styles.statValue}>{playerStats.defense}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Energy</Text>
          <Text style={styles.statValue}>{playerStats.energy}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        {!isPedometerActive ? (
          <TouchableOpacity 
            style={[styles.button, !isPedometerAvailable && styles.buttonDisabled]} 
            onPress={handleStartTracking}
            disabled={!isPedometerAvailable}
          >
            <Text style={styles.buttonText}>Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleStopTracking}
          >
            <Text style={styles.buttonText}>Stop Tracking</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => setShowShop(!showShop)}
        >
          <Text style={styles.navButtonText}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => setShowAchievements(!showAchievements)}
        >
          <Text style={styles.navButtonText}>Achievements</Text>
        </TouchableOpacity>
      </View>

      {showAchievements && <Achievements currentSteps={steps} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.title,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: colors.overlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    ...typography.body,
    marginBottom: 5,
  },
  statValue: {
    ...typography.subtitle,
    color: colors.primary,
  },
  progressContainer: {
    padding: 20,
  },
  progressLabel: {
    ...typography.body,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    ...typography.body,
    textAlign: 'center',
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  statItem: {
    width: '50%',
    padding: 10,
  },
  controls: {
    padding: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.status.info,
    opacity: 0.5,
  },
  buttonText: {
    ...typography.button,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  navButton: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  navButtonText: {
    ...typography.button,
  },
}); 