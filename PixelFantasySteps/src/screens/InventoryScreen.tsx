import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';
import { Card } from '../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const InventoryScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Equipment</Text>
          <View style={styles.itemGrid}>
            <View style={styles.itemSlot}>
              <Icon name="sword" size={32} color={colors.accent} />
              <Text style={styles.itemName}>Mystic Blade</Text>
              <Text style={styles.itemStats}>+10% Steps</Text>
            </View>
            <View style={styles.itemSlot}>
              <Icon name="shield" size={32} color={colors.accent} />
              <Text style={styles.itemName}>Guardian Shield</Text>
              <Text style={styles.itemStats}>Streak Protection</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Consumables</Text>
          <View style={styles.itemGrid}>
            <View style={styles.itemSlot}>
              <Icon name="star" size={32} color={colors.accent} />
              <Text style={styles.itemName}>Lucky Charm</Text>
              <Text style={styles.itemStats}>2x XP (24h)</Text>
            </View>
            <View style={styles.itemSlot}>
              <Icon name="heart" size={32} color={colors.accent} />
              <Text style={styles.itemName}>Health Potion</Text>
              <Text style={styles.itemStats}>Restore Streak</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Collectibles</Text>
          <View style={styles.itemGrid}>
            <View style={styles.itemSlot}>
              <Icon name="crown" size={32} color={colors.accent} />
              <Text style={styles.itemName}>Royal Crown</Text>
              <Text style={styles.itemStats}>Rare Item</Text>
            </View>
            <View style={styles.itemSlot}>
              <Icon name="diamond" size={32} color={colors.accent} />
              <Text style={styles.itemName}>Mystic Gem</Text>
              <Text style={styles.itemStats}>Legendary</Text>
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
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
  },
  itemSlot: {
    width: '50%',
    padding: spacing.md,
    alignItems: 'center',
  },
  itemName: {
    ...typography.body,
    color: colors.text.primary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  itemStats: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
}); 