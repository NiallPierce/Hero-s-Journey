import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CharacterAppearanceProps {
  level: number;
}

interface AppearanceOption {
  id: string;
  name: string;
  image: string;
  unlockLevel: number;
}

const HAIR_STYLES: AppearanceOption[] = [
  {
    id: 'default',
    name: 'Default',
    image: '👨',
    unlockLevel: 1,
  },
  {
    id: 'warrior',
    name: 'Warrior Cut',
    image: '👨‍🦰',
    unlockLevel: 3,
  },
  {
    id: 'mage',
    name: 'Mage Style',
    image: '👨‍🦳',
    unlockLevel: 5,
  },
  {
    id: 'ranger',
    name: 'Ranger Braid',
    image: '👨‍🦱',
    unlockLevel: 7,
  },
];

const ARMOR_STYLES: AppearanceOption[] = [
  {
    id: 'default',
    name: 'Basic Clothes',
    image: '👕',
    unlockLevel: 1,
  },
  {
    id: 'leather',
    name: 'Leather Armor',
    image: '🥋',
    unlockLevel: 4,
  },
  {
    id: 'plate',
    name: 'Plate Armor',
    image: '🛡️',
    unlockLevel: 6,
  },
  {
    id: 'magic',
    name: 'Magic Robes',
    image: '🧙',
    unlockLevel: 8,
  },
];

export const CharacterAppearance: React.FC<CharacterAppearanceProps> = ({ level }) => {
  const [selectedHair, setSelectedHair] = useState<string>('default');
  const [selectedArmor, setSelectedArmor] = useState<string>('default');

  useEffect(() => {
    const loadAppearance = async () => {
      try {
        const savedData = await AsyncStorage.getItem('characterAppearance');
        if (savedData) {
          const { hair, armor } = JSON.parse(savedData);
          setSelectedHair(hair);
          setSelectedArmor(armor);
        }
      } catch (error) {
        console.error('Error loading character appearance:', error);
      }
    };

    loadAppearance();
  }, []);

  const handleAppearanceSelect = async (type: 'hair' | 'armor', id: string) => {
    try {
      const currentData = await AsyncStorage.getItem('characterAppearance');
      const data = currentData ? JSON.parse(currentData) : {};
      const newData = { ...data, [type]: id };
      await AsyncStorage.setItem('characterAppearance', JSON.stringify(newData));
      
      if (type === 'hair') {
        setSelectedHair(id);
      } else {
        setSelectedArmor(id);
      }
    } catch (error) {
      console.error('Error saving character appearance:', error);
    }
  };

  const renderOption = (option: AppearanceOption, type: 'hair' | 'armor', selected: string) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionCard,
        selected === option.id && styles.selectedOption,
        level < option.unlockLevel && styles.lockedOption,
      ]}
      onPress={() => level >= option.unlockLevel && handleAppearanceSelect(type, option.id)}
      disabled={level < option.unlockLevel}
    >
      <Text style={styles.optionEmoji}>{option.image}</Text>
      <Text style={styles.optionName}>{option.name}</Text>
      {level < option.unlockLevel && (
        <Text style={styles.lockedText}>Unlock at Level {option.unlockLevel}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Character Appearance</Text>
      
      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Preview</Text>
        <View style={styles.characterPreview}>
          <Text style={styles.characterEmoji}>
            {ARMOR_STYLES.find(a => a.id === selectedArmor)?.image}
            {HAIR_STYLES.find(h => h.id === selectedHair)?.image}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hair Style</Text>
        <View style={styles.optionsContainer}>
          {HAIR_STYLES.map(option => renderOption(option, 'hair', selectedHair))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Armor Style</Text>
        <View style={styles.optionsContainer}>
          {ARMOR_STYLES.map(option => renderOption(option, 'armor', selectedArmor))}
        </View>
      </View>
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
    marginBottom: 15,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  characterPreview: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
  },
  characterEmoji: {
    fontSize: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3498db',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#e8f5e9',
    borderColor: '#81c784',
  },
  lockedOption: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  optionEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  optionName: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
  },
  lockedText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
  },
}); 