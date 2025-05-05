import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../../styles/theme';

interface ConfettiProps {
  duration?: number;
  onComplete?: () => void;
}

type StatusColor = 'success' | 'warning' | 'info';

export const Confetti: React.FC<ConfettiProps> = ({
  duration = 3000,
  onComplete,
}) => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: new Animated.Value(Math.random() * Dimensions.get('window').width),
    y: new Animated.Value(-20),
    rotation: new Animated.Value(0),
    scale: new Animated.Value(1),
    color: colors.status[['success', 'warning', 'info'][i % 3] as StatusColor],
  }));

  useEffect(() => {
    const animations = particles.map((particle) => {
      const randomX = Math.random() * 200 - 100;
      const randomY = Math.random() * 500 + 200;
      const randomRotation = Math.random() * 360;

      return Animated.parallel([
        Animated.timing(particle.x, {
          toValue: randomX,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: randomY,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle.rotation, {
          toValue: randomRotation,
          duration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: 1.2,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.parallel(animations).start(() => {
      onComplete?.();
    });
  }, [duration, onComplete]);

  return (
    <View style={styles.container}>
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { rotate: particle.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }) },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}); 