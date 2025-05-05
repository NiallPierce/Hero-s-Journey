import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuestCard } from './common/QuestCard';
import { colors, spacing, typography } from '../styles/theme';

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
        <QuestCard
          key={quest.id}
          title={quest.title}
          description={quest.description}
          reward={quest.reward}
          progress={Math.min(100, (currentSteps / quest.stepsRequired) * 100)}
          isCompleted={quest.completed}
          style={styles.questCard}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  questCard: {
    marginBottom: spacing.md,
  },
}); 