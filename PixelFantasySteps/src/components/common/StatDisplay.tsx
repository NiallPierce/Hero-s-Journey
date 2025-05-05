import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';
import { Card } from './Card';

interface Stat {
  label: string;
  value: number | string;
  icon?: string;
  color?: string;
}

interface StatDisplayProps {
  stats: Stat[];
  title?: string;
  variant?: 'default' | 'compact';
  style?: ViewStyle;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  stats,
  title,
  variant = 'default',
  style,
}) => {
  return (
    <Card variant="elevated" style={style}>
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}
      <View style={[
        styles.container,
        variant === 'compact' && styles.compactContainer,
      ]}>
        {stats.map((stat: Stat, index: number) => (
          <View
            key={index}
            style={[
              styles.statItem,
              variant === 'compact' && styles.compactStatItem,
            ]}
          >
            {stat.icon && (
              <Text style={[styles.icon, { color: stat.color || colors.accent }]}>
                {stat.icon}
              </Text>
            )}
            <View style={styles.statContent}>
              <Text style={styles.label}>{stat.label}</Text>
              <Text
                style={[
                  styles.value,
                  { color: stat.color || colors.text.primary },
                ]}
              >
                {stat.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  compactContainer: {
    flexDirection: 'column',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compactStatItem: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  icon: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.xl,
    marginRight: spacing.sm,
  },
  statContent: {
    flex: 1,
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
}); 