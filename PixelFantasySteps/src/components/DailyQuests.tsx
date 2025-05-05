import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Quest {
  id: string;
  title: string;
  description: string;
  stepsRequired: number;
  completed: boolean;
  reward: string;
}

interface DailyQuestsProps {
  currentSteps: number;
}

const generateQuests = (): Quest[] => {
  const questTypes = [
    {
      title: 'Morning Jog',
      description: 'Start your day with a refreshing jog',
      baseSteps: 2000,
    },
    {
      title: 'Forest Path',
      description: 'Explore the mystical forest trails',
      baseSteps: 3000,
    },
    {
      title: 'Mountain Trek',
      description: 'Climb the ancient mountain paths',
      baseSteps: 4000,
    },
  ];

  return questTypes.map((type, index) => ({
    id: `quest-${index}`,
    title: type.title,
    description: type.description,
    stepsRequired: type.baseSteps + Math.floor(Math.random() * 1000),
    completed: false,
    reward: `${Math.floor(type.baseSteps / 100)} XP`,
  }));
};

export const DailyQuests: React.FC<DailyQuestsProps> = ({ currentSteps }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const loadQuests = async () => {
      try {
        const savedData = await AsyncStorage.getItem('dailyQuests');
        if (savedData) {
          const { quests: savedQuests, date } = JSON.parse(savedData);
          const today = new Date().toDateString();
          
          if (date === today) {
            setQuests(savedQuests);
            setLastUpdated(date);
          } else {
            const newQuests = generateQuests();
            setQuests(newQuests);
            setLastUpdated(today);
            await AsyncStorage.setItem('dailyQuests', JSON.stringify({
              quests: newQuests,
              date: today,
            }));
          }
        } else {
          const newQuests = generateQuests();
          setQuests(newQuests);
          setLastUpdated(new Date().toDateString());
          await AsyncStorage.setItem('dailyQuests', JSON.stringify({
            quests: newQuests,
            date: new Date().toDateString(),
          }));
        }
      } catch (error) {
        console.error('Error loading daily quests:', error);
      }
    };

    loadQuests();
  }, []);

  useEffect(() => {
    const updateQuests = async () => {
      const updatedQuests = quests.map(quest => ({
        ...quest,
        completed: currentSteps >= quest.stepsRequired,
      }));

      setQuests(updatedQuests);
      await AsyncStorage.setItem('dailyQuests', JSON.stringify({
        quests: updatedQuests,
        date: lastUpdated,
      }));
    };

    updateQuests();
  }, [currentSteps]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Quests</Text>
      {quests.map(quest => (
        <View
          key={quest.id}
          style={[
            styles.questCard,
            quest.completed ? styles.completedQuest : styles.activeQuest,
          ]}
        >
          <Text style={styles.questTitle}>{quest.title}</Text>
          <Text style={styles.questDescription}>{quest.description}</Text>
          <View style={styles.questProgress}>
            <Text style={styles.stepsText}>
              {Math.min(currentSteps, quest.stepsRequired)} / {quest.stepsRequired} steps
            </Text>
            <Text style={styles.rewardText}>Reward: {quest.reward}</Text>
          </View>
          {quest.completed && (
            <Text style={styles.completedText}>✓ Completed!</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  questCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  activeQuest: {
    backgroundColor: '#fff',
    borderColor: '#3498db',
  },
  completedQuest: {
    backgroundColor: '#e8f5e9',
    borderColor: '#81c784',
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  questDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  questProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsText: {
    fontSize: 14,
    color: '#666',
  },
  rewardText: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: 'bold',
  },
  completedText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginTop: 10,
  },
}); 