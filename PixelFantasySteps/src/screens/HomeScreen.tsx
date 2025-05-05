import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/theme';
import { Card } from '../components/common/Card';
import { AchievementCard } from '../components/common/AchievementCard';
import { QuestCard } from '../components/common/QuestCard';
import { AnimatedButton } from '../components/common/AnimatedButton';

export const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Character Stats Card */}
        <Card style={styles.card}>
          <AchievementCard
            title="Step Master"
            description="Walk 10,000 steps in a day"
            icon="walk"
            progress={75}
            isUnlocked={false}
          />
        </Card>

        {/* Daily Quest */}
        <Card style={styles.card}>
          <QuestCard
            title="Daily Challenge"
            description="Complete 5,000 steps before sunset"
            reward="100 XP"
            progress={60}
            isCompleted={false}
          />
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <AnimatedButton
            title="Start Adventure"
            onPress={() => {}}
            variant="primary"
            style={styles.button}
          />
          <AnimatedButton
            title="View Achievements"
            onPress={() => {}}
            variant="secondary"
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
}); 