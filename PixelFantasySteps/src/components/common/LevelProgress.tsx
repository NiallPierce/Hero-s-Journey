import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  rank?: string;
  onLevelUp?: () => void;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  currentLevel,
  currentXP,
  xpToNextLevel,
  rank,
  onLevelUp,
}) => {
  const progress = (currentXP / xpToNextLevel) * 100;
  const levelAnim = new Animated.Value(0);
  const glowAnim = new Animated.Value(0);

  useEffect(() => {
    if (currentXP >= xpToNextLevel) {
      Animated.sequence([
        Animated.timing(levelAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onLevelUp?.();
      });
    }
  }, [currentXP, xpToNextLevel]);

  const scale = levelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <Card variant="elevated">
      <View style={styles.container}>
        <View style={styles.levelContainer}>
          <Animated.View
            style={[
              styles.levelBadge,
              {
                transform: [{ scale }],
              },
            ]}
          >
            <Text style={styles.levelText}>LVL {currentLevel}</Text>
            {rank && <Text style={styles.rankText}>{rank}</Text>}
          </Animated.View>
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowOpacity,
              },
            ]}
          />
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.xpText}>
            {currentXP} / {xpToNextLevel} XP
          </Text>
          <ProgressBar
            progress={progress}
            height={8}
            showPercentage={false}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border,
  },
  levelText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  rankText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: spacing.xl,
    opacity: 0,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  xpText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
}); 