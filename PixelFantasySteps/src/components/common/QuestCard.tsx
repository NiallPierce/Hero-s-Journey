import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography } from '../../styles/theme';
import { ProgressBar } from './ProgressBar';

interface QuestCardProps {
  title: string;
  description: string;
  reward: string;
  progress: number;
  isCompleted: boolean;
  style?: any;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  reward,
  progress,
  isCompleted,
  style,
}) => {
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isCompleted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isCompleted]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: isCompleted ? glowOpacity : 0,
            backgroundColor: colors.accent,
          },
        ]}
      />
      <View style={styles.header}>
        <Icon
          name={isCompleted ? 'check-circle' : 'sword'}
          size={24}
          color={isCompleted ? colors.status.success : colors.accent}
          style={styles.icon}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.rewardContainer}>
        <Icon name="gift" size={20} color={colors.accent} />
        <Text style={styles.reward}>{reward}</Text>
      </View>
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          height={8}
          color={isCompleted ? colors.status.success : colors.accent}
        />
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reward: {
    ...typography.body,
    color: colors.accent,
    marginLeft: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
}); 