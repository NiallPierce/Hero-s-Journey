import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography } from '../../styles/theme';
import { ProgressBar } from './ProgressBar';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  progress: number;
  isUnlocked: boolean;
  style?: any;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  progress,
  isUnlocked,
  style,
}) => {
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isUnlocked) {
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
  }, [isUnlocked]);

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
            opacity: isUnlocked ? glowOpacity : 0,
            backgroundColor: colors.accent,
          },
        ]}
      />
      <View style={styles.header}>
        <Icon
          name={isUnlocked ? 'trophy' : icon}
          size={24}
          color={isUnlocked ? colors.status.success : colors.accent}
          style={styles.icon}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          height={8}
          color={isUnlocked ? colors.status.success : colors.accent}
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