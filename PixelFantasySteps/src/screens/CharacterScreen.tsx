import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../styles/theme';
import { Card } from '../components/common/Card';
import { CharacterLevel } from '../components/CharacterLevel';

export const CharacterScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <CharacterLevel
            currentSteps={7500}
          />
        </Card>

        <Card style={styles.card}>
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Strength</Text>
              <Text style={styles.statValue}>15</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Agility</Text>
              <Text style={styles.statValue}>12</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Endurance</Text>
              <Text style={styles.statValue}>18</Text>
            </View>
          </View>
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
  statsContainer: {
    padding: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
  },
}); 