import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/theme';
import { Card } from '../components/common/Card';
import { QuestCard } from '../components/common/QuestCard';

export const QuestsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <QuestCard
            title="Daily Challenge"
            description="Complete 5,000 steps before sunset"
            reward="100 XP"
            progress={60}
            isCompleted={false}
          />
        </Card>

        <Card style={styles.card}>
          <QuestCard
            title="Weekly Expedition"
            description="Walk 35,000 steps this week"
            reward="500 XP + Rare Item"
            progress={45}
            isCompleted={false}
          />
        </Card>

        <Card style={styles.card}>
          <QuestCard
            title="Mountain Climber"
            description="Reach 10,000 steps in a single day"
            reward="200 XP + Achievement"
            progress={80}
            isCompleted={false}
          />
        </Card>
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
}); 