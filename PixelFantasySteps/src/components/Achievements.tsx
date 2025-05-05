import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Achievement {
  id: string;
  title: string;
  description: string;
  stepsRequired: number;
  unlocked: boolean;
}

interface AchievementsProps {
  currentSteps: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Novice Adventurer',
    description: 'Take your first steps on the path of adventure',
    stepsRequired: 1000,
    unlocked: false,
  },
  {
    id: '2',
    title: 'Forest Explorer',
    description: 'Journey through the mystical forest',
    stepsRequired: 5000,
    unlocked: false,
  },
  {
    id: '3',
    title: 'Mountain Climber',
    description: 'Scale the heights of the ancient mountains',
    stepsRequired: 10000,
    unlocked: false,
  },
  {
    id: '4',
    title: 'Dragon Slayer',
    description: 'Complete an epic journey worthy of legend',
    stepsRequired: 20000,
    unlocked: false,
  },
];

export const Achievements: React.FC<AchievementsProps> = ({ currentSteps }) => {
  const checkAchievements = () => {
    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: currentSteps >= achievement.stepsRequired,
    }));
  };

  const achievements = checkAchievements();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      {achievements.map(achievement => (
        <View
          key={achievement.id}
          style={[
            styles.achievementCard,
            achievement.unlocked ? styles.unlocked : styles.locked,
          ]}
        >
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementDescription}>
            {achievement.description}
          </Text>
          <Text style={styles.stepsRequired}>
            {achievement.stepsRequired.toLocaleString()} steps
          </Text>
          {achievement.unlocked && (
            <Text style={styles.unlockedText}>✓ Unlocked!</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  achievementCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  unlocked: {
    backgroundColor: '#e8f5e9',
    borderColor: '#81c784',
  },
  locked: {
    backgroundColor: '#f5f5f5',
    borderColor: '#bdbdbd',
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  stepsRequired: {
    fontSize: 12,
    color: '#888',
  },
  unlockedText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginTop: 5,
  },
}); 