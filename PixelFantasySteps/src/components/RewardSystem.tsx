import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Reward {
  steps: number;
  experience: number;
  type: 'combat' | 'quest' | 'achievement';
  message: string;
}

interface RewardSystemProps {
  onRewardEarned: (reward: Reward) => void;
  characterClass?: string;
}

export const RewardSystem: React.FC<RewardSystemProps> = ({ onRewardEarned, characterClass }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  const calculateClassBonus = (baseReward: number): number => {
    switch (characterClass) {
      case 'Warrior':
        return Math.floor(baseReward * 1.2); // 20% bonus to combat rewards
      case 'Mage':
        return Math.floor(baseReward * 1.1); // 10% bonus to all rewards
      case 'Rogue':
        return Math.floor(baseReward * 1.15); // 15% bonus to quest rewards
      default:
        return baseReward;
    }
  };

  const addReward = (reward: Reward) => {
    const bonusReward = {
      ...reward,
      steps: calculateClassBonus(reward.steps),
      experience: calculateClassBonus(reward.experience)
    };

    setRewards(prev => [...prev, bonusReward]);
    onRewardEarned(bonusReward);

    // Animate reward notification
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start(() => {
      setRewards(prev => prev.filter(r => r !== bonusReward));
    });
  };

  return (
    <View style={styles.container}>
      {rewards.map((reward, index) => (
        <Animated.View
          key={index}
          style={[
            styles.rewardContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.rewardMessage}>{reward.message}</Text>
          <Text style={styles.rewardDetails}>
            +{reward.steps} Steps • +{reward.experience} XP
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  rewardContainer: {
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rewardMessage: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rewardDetails: {
    color: '#fff',
    fontSize: 14,
  },
}); 