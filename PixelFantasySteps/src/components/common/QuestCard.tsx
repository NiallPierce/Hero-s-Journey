import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';
import { ProgressBar } from './ProgressBar';

interface QuestCardProps {
  title: string;
  description: string;
  reward: number;
  progress: number;
  isCompleted: boolean;
  onPress?: () => void;
  style?: any;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  reward,
  progress,
  isCompleted,
  onPress,
  style,
}) => {
  const glowAnim = new Animated.Value(0);

  React.useEffect(() => {
    if (isCompleted) {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCompleted]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: glowAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0.8, 1],
          }),
          transform: [
            {
              scale: glowAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1.05, 1],
              }),
            },
          ],
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.reward}>+{reward} coins</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          height={6}
          backgroundColor={colors.surface}
          progressColor={isCompleted ? colors.status.success : colors.accent}
        />
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  reward: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    fontWeight: 'bold',
  },
  description: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
}); 