import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../../styles/theme';

interface ScreenTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  onTransitionComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  isVisible,
  onTransitionComplete,
}) => {
  const fogOpacity = new Animated.Value(0);
  const contentScale = new Animated.Value(1);
  const contentOpacity = new Animated.Value(1);

  useEffect(() => {
    if (isVisible) {
      // Fade in animation
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fogOpacity, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(contentScale, {
            toValue: 0.95,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }),
          Animated.timing(contentOpacity, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fogOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(contentScale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }),
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onTransitionComplete?.();
      });
    }
  }, [isVisible]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: contentScale }],
            opacity: contentOpacity,
          },
        ]}
      >
        {children}
      </Animated.View>
      <Animated.View
        style={[
          styles.fog,
          {
            opacity: fogOpacity,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  fog: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 2,
  },
}); 