import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../styles/theme';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  milestones?: number[];
  style?: any;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 4,
  color = colors.accent,
  milestones = [],
  style,
}) => {
  const widthAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={[styles.container, { height }, style]}>
      <Animated.View
        style={[
          styles.progress,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: color,
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
              backgroundColor: progress >= milestone ? color : colors.border,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  milestone: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: colors.border,
  },
}); 