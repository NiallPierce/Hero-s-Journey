import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, shadows, borderRadius, spacing } from '../../styles/theme';

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onPress,
  title,
  style,
  textStyle,
  disabled = false,
  variant = 'primary',
}) => {
  const [scale] = useState(new Animated.Value(1));
  const [glowOpacity] = useState(new Animated.Value(0));
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (isPressed) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.4,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isPressed]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          textColor: colors.text.primary,
        };
      case 'accent':
        return {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
          textColor: colors.text.primary,
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          textColor: colors.text.primary,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: variantStyles.backgroundColor,
            borderColor: variantStyles.borderColor,
            transform: [{ scale }],
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
              backgroundColor: variantStyles.backgroundColor,
            },
          ]}
        />
        <Text
          style={[
            styles.text,
            { color: variantStyles.textColor },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: borderRadius.lg,
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    ...typography.subtitle,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 