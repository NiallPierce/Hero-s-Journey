import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CharacterClass {
  id: string;
  name: string;
  description: string;
  bonus: string;
}

interface CharacterCustomizationProps {
  level: number;
  onClassSelect: (classId: string) => void;
}

const CHARACTER_CLASSES: CharacterClass[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'A mighty warrior who gains bonus steps from intense activities',
    bonus: '2x steps from running',
  },
  {
    id: 'mage',
    name: 'Mage',
    description: 'A wise mage who gains bonus steps from walking meditation',
    bonus: '1.5x steps from walking',
  },
  {
    id: 'ranger',
    name: 'Ranger',
    description: 'A swift ranger who gains bonus steps from outdoor activities',
    bonus: '1.5x steps from hiking',
  },
  {
    id: 'monk',
    name: 'Monk',
    description: 'A disciplined monk who gains bonus steps from mindful movement',
    bonus: '2x steps from yoga',
  },
];

export const CharacterCustomization: React.FC<CharacterCustomizationProps> = ({ level, onClassSelect }) => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [characterName, setCharacterName] = useState<string>('');

  useEffect(() => {
    const loadCharacterData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('characterData');
        if (savedData) {
          const { class: savedClass, name: savedName } = JSON.parse(savedData);
          setSelectedClass(savedClass);
          setCharacterName(savedName);
        }
      } catch (error) {
        console.error('Error loading character data:', error);
      }
    };

    loadCharacterData();
  }, []);

  const handleClassSelect = async (classId: string) => {
    setSelectedClass(classId);
    onClassSelect(classId);
    try {
      const currentData = await AsyncStorage.getItem('characterData');
      const data = currentData ? JSON.parse(currentData) : {};
      await AsyncStorage.setItem('characterData', JSON.stringify({
        ...data,
        class: classId,
      }));
    } catch (error) {
      console.error('Error saving character class:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Character Customization</Text>
      <Text style={styles.levelRequirement}>
        Level {level} Required for Class Selection
      </Text>
      
      <ScrollView style={styles.classesContainer}>
        {CHARACTER_CLASSES.map(charClass => (
          <TouchableOpacity
            key={charClass.id}
            style={[
              styles.classCard,
              selectedClass === charClass.id && styles.selectedClass,
              level < 5 && styles.lockedClass,
            ]}
            onPress={() => level >= 5 && handleClassSelect(charClass.id)}
            disabled={level < 5}
          >
            <Text style={styles.className}>{charClass.name}</Text>
            <Text style={styles.classDescription}>{charClass.description}</Text>
            <Text style={styles.classBonus}>Bonus: {charClass.bonus}</Text>
            {level < 5 && (
              <Text style={styles.lockedText}>Unlock at Level 5</Text>
            )}
            {selectedClass === charClass.id && (
              <Text style={styles.selectedText}>✓ Selected</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  levelRequirement: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  classesContainer: {
    maxHeight: 300,
  },
  classCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    backgroundColor: '#fff',
  },
  selectedClass: {
    backgroundColor: '#e8f5e9',
    borderColor: '#81c784',
  },
  lockedClass: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  classDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  classBonus: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: 'bold',
  },
  lockedText: {
    color: '#e74c3c',
    marginTop: 5,
    fontSize: 12,
  },
  selectedText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginTop: 5,
  },
}); 