import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '../../styles/theme';

interface CharacterAvatarProps {
  image: any;
  size?: number;
  borderColor?: string;
  glowColor?: string;
  isAnimated?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  image,
  size = 120,
  borderColor = colors.accent,
  glowColor = colors.accent,
  isAnimated = true,
}) => {
  const scale = new Animated.Value(1);
  const glowOpacity = new Animated.Value(0.5);

  useEffect(() => {
    if (isAnimated) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1.05,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.8,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.5,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }
  }, [isAnimated]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.glow,
          {
            width: size,
            height: size,
            backgroundColor: glowColor,
            opacity: glowOpacity,
            transform: [{ scale }],
          },
        ]}
      />
      <View
        style={[
          styles.border,
          {
            width: size,
            height: size,
            borderColor,
          },
        ]}
      >
        <Image source={image} style={[styles.image, { width: size, height: size }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: spacing.xl,
  },
  border: {
    borderRadius: spacing.xl,
    borderWidth: 2,
    overflow: 'hidden',
  },
  image: {
    borderRadius: spacing.xl,
  },
}); 