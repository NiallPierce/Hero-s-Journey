import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, ViewStyle, StyleProp } from 'react-native';
import { colors, shadows, borderRadius } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, animated = true }) => {
  const scale = new Animated.Value(1);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animated]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale }],
          opacity,
        },
        style,
      ]}
    >
      <View style={styles.content}>{children}</View>
      <View style={styles.glow} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.large,
  },
  content: {
    padding: 16,
    position: 'relative',
    zIndex: 1,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: borderRadius.lg,
    opacity: 0.1,
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
}); 