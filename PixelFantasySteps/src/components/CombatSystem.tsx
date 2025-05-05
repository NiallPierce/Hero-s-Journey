import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RewardSystem } from './RewardSystem';

interface Monster {
  id: number;
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  image: string;
  reward: {
    steps: number;
    experience: number;
  };
}

interface CombatState {
  isInCombat: boolean;
  currentMonster: Monster | null;
  playerHealth: number;
  playerMaxHealth: number;
  playerAttack: number;
  playerDefense: number;
  playerEnergy: number;
}

interface PlayerStats {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  energy: number;
}

interface CombatSystemProps {
  currentSteps: number;
  characterClass?: string;
  onRewardEarned: (reward: { steps: number; experience: number; type: string; message: string }) => void;
  playerStats: PlayerStats;
}

const MONSTERS: Monster[] = [
  {
    id: 1,
    name: 'Step Slime',
    health: 50,
    maxHealth: 50,
    attack: 5,
    defense: 2,
    image: '🟢',
    reward: { steps: 100, experience: 50 }
  },
  {
    id: 2,
    name: 'Fitness Golem',
    health: 100,
    maxHealth: 100,
    attack: 8,
    defense: 5,
    image: '🗿',
    reward: { steps: 200, experience: 100 }
  },
  {
    id: 3,
    name: 'Exercise Dragon',
    health: 150,
    maxHealth: 150,
    attack: 12,
    defense: 8,
    image: '🐉',
    reward: { steps: 300, experience: 150 }
  }
];

export const CombatSystem: React.FC<CombatSystemProps> = ({ 
  currentSteps,
  characterClass,
  onRewardEarned,
  playerStats
}) => {
  const [combatState, setCombatState] = useState<CombatState>({
    isInCombat: false,
    currentMonster: null,
    playerHealth: playerStats.health,
    playerMaxHealth: playerStats.maxHealth,
    playerAttack: playerStats.attack,
    playerDefense: playerStats.defense,
    playerEnergy: 0
  });

  useEffect(() => {
    // Update combat state when player stats change
    setCombatState(prev => ({
      ...prev,
      playerHealth: playerStats.health,
      playerMaxHealth: playerStats.maxHealth,
      playerAttack: playerStats.attack,
      playerDefense: playerStats.defense
    }));
  }, [playerStats]);

  useEffect(() => {
    // Convert steps to combat energy (1 energy per 100 steps)
    setCombatState(prev => ({
      ...prev,
      playerEnergy: Math.floor(currentSteps / 100)
    }));
  }, [currentSteps]);

  const startCombat = () => {
    const randomMonster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    setCombatState(prev => ({
      ...prev,
      isInCombat: true,
      currentMonster: randomMonster
    }));
  };

  const attack = () => {
    if (!combatState.currentMonster || combatState.playerEnergy < 1) return;

    // Player's turn
    const damage = Math.max(1, combatState.playerAttack - combatState.currentMonster.defense);
    const newMonsterHealth = Math.max(0, combatState.currentMonster.health - damage);
    
    // Monster's turn
    const monsterDamage = Math.max(1, combatState.currentMonster.attack - combatState.playerDefense);
    const newPlayerHealth = Math.max(0, combatState.playerHealth - monsterDamage);

    setCombatState(prev => ({
      ...prev,
      playerEnergy: prev.playerEnergy - 1,
      playerHealth: newPlayerHealth,
      currentMonster: {
        ...prev.currentMonster!,
        health: newMonsterHealth
      }
    }));

    // Check for combat end
    if (newMonsterHealth === 0 || newPlayerHealth === 0) {
      endCombat(newMonsterHealth === 0);
    }
  };

  const handleRewardEarned = (reward: { steps: number; experience: number; type: string; message: string }) => {
    // Update steps and experience in parent component
    // This will be handled by the parent component
  };

  const endCombat = (victory: boolean) => {
    if (victory && combatState.currentMonster) {
      const { steps, experience } = combatState.currentMonster.reward;
      handleRewardEarned({
        steps,
        experience,
        type: 'combat',
        message: `Defeated ${combatState.currentMonster.name}!`
      });
    }

    setCombatState(prev => ({
      ...prev,
      isInCombat: false,
      currentMonster: null,
      playerHealth: prev.playerMaxHealth
    }));
  };

  if (!combatState.isInCombat) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Combat Arena</Text>
        <Text style={styles.energyText}>Energy: {combatState.playerEnergy}</Text>
        <TouchableOpacity
          style={[styles.button, combatState.playerEnergy < 1 && styles.buttonDisabled]}
          onPress={startCombat}
          disabled={combatState.playerEnergy < 1}
        >
          <Text style={styles.buttonText}>Find Monster</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RewardSystem 
        onRewardEarned={handleRewardEarned}
        characterClass={characterClass}
      />
      <Text style={styles.title}>Combat</Text>
      
      {/* Monster */}
      <View style={styles.monsterContainer}>
        <Text style={styles.monsterName}>{combatState.currentMonster?.name}</Text>
        <Text style={styles.monsterImage}>{combatState.currentMonster?.image}</Text>
        <View style={styles.healthBar}>
          <View 
            style={[
              styles.healthFill,
              { width: `${(combatState.currentMonster?.health || 0) / (combatState.currentMonster?.maxHealth || 1) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.healthText}>
          {combatState.currentMonster?.health}/{combatState.currentMonster?.maxHealth}
        </Text>
      </View>

      {/* Player */}
      <View style={styles.playerContainer}>
        <Text style={styles.playerName}>You</Text>
        <View style={styles.healthBar}>
          <View 
            style={[
              styles.healthFill,
              { width: `${combatState.playerHealth / combatState.playerMaxHealth * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.healthText}>
          {combatState.playerHealth}/{combatState.playerMaxHealth}
        </Text>
      </View>

      {/* Combat Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, combatState.playerEnergy < 1 && styles.buttonDisabled]}
          onPress={attack}
          disabled={combatState.playerEnergy < 1}
        >
          <Text style={styles.buttonText}>Attack (1 Energy)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.fleeButton]}
          onPress={() => endCombat(false)}
        >
          <Text style={styles.buttonText}>Flee</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  energyText: {
    fontSize: 16,
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 10,
  },
  monsterContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  monsterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  monsterImage: {
    fontSize: 40,
    marginVertical: 10,
  },
  playerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  healthBar: {
    width: '100%',
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
  },
  healthFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
  },
  healthText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    padding: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
  },
  fleeButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 