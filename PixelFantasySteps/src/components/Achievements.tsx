import React from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Card } from './common/Card';
import { colors, typography, spacing, shadows } from '../styles/theme';

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

export const Achievements: React.FC<AchievementsProps> = ({ currentSteps }: AchievementsProps) => {
  const checkAchievements = (): Achievement[] => {
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
        <Card
          key={achievement.id}
          style={[
            styles.achievementCard,
            achievement.unlocked ? styles.unlocked : styles.locked,
          ] as ViewStyle}
        >
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
            <Text style={styles.stepsRequired}>
              {achievement.stepsRequired.toLocaleString()} steps
            </Text>
            {achievement.unlocked && (
              <View style={styles.unlockedBadge}>
                <Text style={styles.unlockedText}>✓ Unlocked!</Text>
              </View>
            )}
          </View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  achievementCard: {
    marginBottom: spacing.sm,
  },
  achievementContent: {
    position: 'relative',
  },
  unlocked: {
    backgroundColor: colors.status.success + '10',
    borderColor: colors.status.success,
  },
  locked: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  achievementTitle: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  stepsRequired: {
    ...typography.small,
    color: colors.text.secondary,
  },
  unlockedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.status.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    ...shadows.small,
  },
  unlockedText: {
    ...typography.small,
    color: colors.surface,
    fontWeight: '700',
  },
}); 