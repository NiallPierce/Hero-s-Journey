import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';
import { Card } from '../components/common/Card';
import { AnimatedButton } from '../components/common/AnimatedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const ShopScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <Icon name="currency-usd" size={24} color={colors.accent} />
            <Text style={styles.currency}>1,500</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.itemContainer}>
            <Icon name="sword" size={32} color={colors.accent} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>Mystic Blade</Text>
              <Text style={styles.itemDescription}>Increases step count by 10%</Text>
              <Text style={styles.itemPrice}>500 coins</Text>
            </View>
            <AnimatedButton
              title="Buy"
              onPress={() => {}}
              variant="secondary"
              style={styles.buyButton}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.itemContainer}>
            <Icon name="shield" size={32} color={colors.accent} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>Guardian Shield</Text>
              <Text style={styles.itemDescription}>Protects your daily streak</Text>
              <Text style={styles.itemPrice}>750 coins</Text>
            </View>
            <AnimatedButton
              title="Buy"
              onPress={() => {}}
              variant="secondary"
              style={styles.buyButton}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.itemContainer}>
            <Icon name="star" size={32} color={colors.accent} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>Lucky Charm</Text>
              <Text style={styles.itemDescription}>Doubles XP for 24 hours</Text>
              <Text style={styles.itemPrice}>1,000 coins</Text>
            </View>
            <AnimatedButton
              title="Buy"
              onPress={() => {}}
              variant="secondary"
              style={styles.buyButton}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  currency: {
    ...typography.h2,
    color: colors.accent,
    marginLeft: spacing.sm,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemName: {
    ...typography.h3,
    color: colors.text.primary,
  },
  itemDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  itemPrice: {
    ...typography.caption,
    color: colors.accent,
    marginTop: spacing.xs,
  },
  buyButton: {
    minWidth: 80,
  },
}); 