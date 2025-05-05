import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Card } from './common/Card';
import { ProgressBar } from './common/ProgressBar';
import { Toast } from './common/Toast';
import Confetti from './common/Confetti';
import { colors, typography, spacing, shadows, borderRadius } from '../styles/theme';

interface CharacterLevelProps {
  currentSteps: number;
}

interface Rank {
  title: string;
  subLevels: number;
  stepsRequired: number;
}

const RANKS: Rank[] = [
  { title: 'Novice', subLevels: 5, stepsRequired: 1000 },
  { title: 'Apprentice', subLevels: 5, stepsRequired: 5000 },
  { title: 'Adventurer', subLevels: 5, stepsRequired: 10000 },
  { title: 'Explorer', subLevels: 5, stepsRequired: 20000 },
  { title: 'Hero', subLevels: 5, stepsRequired: 40000 },
  { title: 'Champion', subLevels: 5, stepsRequired: 80000 },
  { title: 'Master', subLevels: 5, stepsRequired: 160000 },
  { title: 'Legend', subLevels: 5, stepsRequired: 320000 },
  { title: 'Mythic', subLevels: 5, stepsRequired: 640000 },
  { title: 'Divine', subLevels: 5, stepsRequired: 1000000 },
  { title: 'Celestial', subLevels: 5, stepsRequired: 2000000 },
  { title: 'Cosmic', subLevels: 5, stepsRequired: 4000000 },
  { title: 'Eternal', subLevels: 5, stepsRequired: 8000000 },
  { title: 'Transcendent', subLevels: 5, stepsRequired: 16000000 },
  { title: 'Omnipotent', subLevels: 5, stepsRequired: 32000000 }
];

const calculateRankAndSubLevel = (steps: number): { rank: Rank; subLevel: number; progress: number } => {
  let totalStepsRequired = 0;
  
  for (let i = 0; i < RANKS.length; i++) {
    const rank = RANKS[i];
    const nextRank = RANKS[i + 1];
    
    if (!nextRank || steps < totalStepsRequired + rank.stepsRequired) {
      const stepsInCurrentRank = steps - totalStepsRequired;
      const stepsPerSubLevel = rank.stepsRequired / rank.subLevels;
      const subLevel = Math.floor(stepsInCurrentRank / stepsPerSubLevel) + 1;
      const progress = ((stepsInCurrentRank % stepsPerSubLevel) / stepsPerSubLevel) * 100;
      
      return {
        rank,
        subLevel: Math.min(subLevel, rank.subLevels),
        progress: Math.min(100, Math.max(0, progress))
      };
    }
    
    totalStepsRequired += rank.stepsRequired;
  }
  
  // If we get here, the player has reached the maximum rank
  return {
    rank: RANKS[RANKS.length - 1],
    subLevel: RANKS[RANKS.length - 1].subLevels,
    progress: 100
  };
};

const getRankColor = (rankTitle: string): string => {
  const rankKey = rankTitle.toLowerCase() as keyof typeof colors.ranks;
  return colors.ranks[rankKey] || colors.ranks.novice;
};

export const CharacterLevel: React.FC<CharacterLevelProps> = ({ currentSteps }: CharacterLevelProps) => {
  const [rankInfo, setRankInfo] = useState(calculateRankAndSubLevel(currentSteps));
  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const scale = new Animated.Value(1);
  const opacity = new Animated.Value(1);
  const rankColor = getRankColor(rankInfo.rank.title);

  useEffect(() => {
    const newRankInfo = calculateRankAndSubLevel(currentSteps);
    if (newRankInfo.subLevel > rankInfo.subLevel || 
        (newRankInfo.rank.title !== rankInfo.rank.title && newRankInfo.subLevel === 1)) {
      setRankInfo(newRankInfo);
      
      // Show confetti immediately
      setShowConfetti(true);
      
      // Show toast after a short delay
      setTimeout(() => {
        setShowToast(true);
      }, 500);
      
      // Reset confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    } else {
      // Update progress even if rank hasn't changed
      setRankInfo(newRankInfo);
    }
  }, [currentSteps]);

  const handleConfettiComplete = () => {
    console.log('Confetti animation completed');
    setShowConfetti(false);
  };

  const handleToastClose = () => {
    setShowToast(false);
  };

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.2,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(opacity, {
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
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [rankInfo.subLevel]);

  return (
    <>
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={[styles.container, { backgroundColor: rankColor }]}>
          <Text style={styles.title}>Character Rank</Text>
          <View style={styles.levelContainer}>
            <Animated.Text 
              style={[
                styles.levelText,
                { 
                  transform: [{ scale }],
                  opacity,
                  textShadowColor: 'rgba(0, 0, 0, 0.7)',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 4,
                }
              ]}
            >
              {rankInfo.rank.title} {rankInfo.subLevel}
            </Animated.Text>
          </View>
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={rankInfo.progress}
              milestones={[25, 50, 75]}
              height={12}
              color={colors.accent}
            />
            <Text style={styles.progressText}>
              {Math.round(rankInfo.progress)}% to next rank
            </Text>
          </View>
        </View>
      </Card>
      {showConfetti && (
        <View style={styles.confettiContainer}>
          <Confetti onComplete={handleConfettiComplete} />
        </View>
      )}
      {showToast && (
        <Toast
          message={`Rank Up! You are now ${rankInfo.rank.title} ${rankInfo.subLevel}`}
          type="success"
          onClose={handleToastClose}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    ...shadows.large,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  container: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  levelText: {
    ...typography.title,
    fontSize: 36,
    color: colors.text.primary,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  progressContainer: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  progressText: {
    ...typography.small,
    color: colors.text.primary,
    marginTop: spacing.xs,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'none',
    elevation: 9999,
  },
}); 