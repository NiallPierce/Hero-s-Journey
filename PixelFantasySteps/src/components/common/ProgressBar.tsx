import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '../../styles/theme';

interface ProgressBarProps {
  progress: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  animated?: boolean;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = colors.surface,
  progressColor = colors.accent,
  animated = true,
  showPercentage = false,
}) => {
  const width = new Animated.Value(0);

  useEffect(() => {
    if (animated) {
      Animated.spring(width, {
        toValue: progress,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }).start();
    } else {
      width.setValue(progress);
    }
  }, [progress, animated]);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.progress,
          {
            backgroundColor: progressColor,
            width: width.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.xs,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: spacing.xs,
  },
}); 