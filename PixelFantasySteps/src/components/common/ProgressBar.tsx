import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, typography, borderRadius } from '../../styles/theme';

interface ProgressBarProps {
  progress: number;
  milestones?: number[];
  height?: number;
  showPercentage?: boolean;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  milestones = [],
  height = 10,
  showPercentage = true,
  color = colors.accent,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              height,
              backgroundColor: color,
              width,
            },
          ]}
        />
        {milestones.map((milestone, index) => (
          <View
            key={index}
            style={[
              styles.milestone,
              {
                left: `${milestone}%`,
                height: height * 1.5,
              },
            ]}
          />
        ))}
      </View>
      {showPercentage && (
        <Animated.Text style={styles.percentage}>
          {Math.round(progress)}%
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fill: {
    borderRadius: borderRadius.sm,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  milestone: {
    position: 'absolute',
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: -25,
  },
  percentage: {
    ...typography.small,
    color: colors.text.primary,
    marginTop: 4,
    textAlign: 'right',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 