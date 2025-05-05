import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../../styles/theme';

interface ConfettiProps {
  duration?: number;
  onComplete?: () => void;
}

interface ConfettiPiece {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

const COLORS = [
  colors.primary,
  colors.secondary,
  colors.status.success,
  colors.status.warning,
  colors.status.error,
];

const Confetti: React.FC<ConfettiProps> = ({
  duration = 3000,
  onComplete,
}) => {
  const pieces = useRef<ConfettiPiece[]>([]).current;
  const animations = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    const numPieces = 150;

    // Initialize confetti pieces
    for (let i = 0; i < numPieces; i++) {
      pieces.push({
        x: Math.random() * width,
        y: -50, // Start above the screen
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4, // Slightly smaller pieces
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });

      animations.push(new Animated.Value(0));
    }

    // Animate each piece
    const animationPromises = animations.map((anim: Animated.Value, index: number) => {
      return new Promise<void>((resolve) => {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration * (0.5 + Math.random() * 0.5), // Slower animation
            useNativeDriver: true,
          }),
        ]).start(() => resolve());
      });
    });

    Promise.all(animationPromises).then(() => {
      onComplete?.();
    });

    return () => {
      animations.forEach((anim: Animated.Value) => anim.stopAnimation());
    };
  }, []);

  return (
    <View style={styles.container}>
      {pieces.map((piece: ConfettiPiece, index: number) => {
        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, Dimensions.get('window').height + 100],
        });

        const translateX = animations[index].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, Math.random() * 200 - 100, Math.random() * 400 - 200],
        });

        const rotate = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [`${piece.rotation}deg`, `${piece.rotation + 720}deg`],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.piece,
              {
                left: piece.x,
                top: piece.y,
                backgroundColor: piece.color,
                transform: [
                  { translateY },
                  { translateX },
                  { rotate },
                  { scale: piece.scale },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 9999,
    elevation: 9999,
  },
  piece: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.8,
  },
});

export default Confetti; 