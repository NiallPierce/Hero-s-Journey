import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CharacterLevelProps {
  currentSteps: number;
}

const calculateLevel = (steps: number): number => {
  return Math.floor(Math.sqrt(steps / 1000)) + 1;
};

const calculateProgress = (steps: number): number => {
  const currentLevel = calculateLevel(steps);
  const stepsForCurrentLevel = Math.pow(currentLevel - 1, 2) * 1000;
  const stepsForNextLevel = Math.pow(currentLevel, 2) * 1000;
  const progress = ((steps - stepsForCurrentLevel) / (stepsForNextLevel - stepsForCurrentLevel)) * 100;
  return Math.min(100, Math.max(0, progress));
};

const getLevelTitle = (level: number): string => {
  const titles = [
    'Novice',
    'Apprentice',
    'Adventurer',
    'Explorer',
    'Hero',
    'Champion',
    'Master',
    'Legend',
    'Mythic',
    'Divine'
  ];
  return titles[Math.min(level - 1, titles.length - 1)];
};

export const CharacterLevel: React.FC<CharacterLevelProps> = ({ currentSteps }) => {
  const level = calculateLevel(currentSteps);
  const progress = calculateProgress(currentSteps);
  const levelTitle = getLevelTitle(level);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Character Level</Text>
      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>Level {level}</Text>
        <Text style={styles.levelTitle}>{levelTitle}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}% to next level</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  levelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db',
  },
  levelTitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 5,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'center',
  },
}); 