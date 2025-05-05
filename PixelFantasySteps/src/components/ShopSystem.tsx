import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'consumable' | 'equipment' | 'ability';
  effect: {
    type: 'health' | 'attack' | 'defense' | 'energy';
    value: number;
  };
  image: string;
}

interface ShopSystemProps {
  currentSteps: number;
  onPurchase: (item: ShopItem) => void;
  characterClass?: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restore 50 health points',
    cost: 500,
    type: 'consumable',
    effect: {
      type: 'health',
      value: 50
    },
    image: '❤️'
  },
  {
    id: 'energy_boost',
    name: 'Energy Boost',
    description: 'Gain 2 extra energy points',
    cost: 1000,
    type: 'consumable',
    effect: {
      type: 'energy',
      value: 2
    },
    image: '⚡'
  },
  {
    id: 'warrior_sword',
    name: 'Warrior\'s Sword',
    description: 'Increase attack by 5',
    cost: 2000,
    type: 'equipment',
    effect: {
      type: 'attack',
      value: 5
    },
    image: '⚔️'
  },
  {
    id: 'mage_staff',
    name: 'Mage\'s Staff',
    description: 'Increase attack by 3 and energy by 1',
    cost: 2500,
    type: 'equipment',
    effect: {
      type: 'attack',
      value: 3
    },
    image: '🪄'
  },
  {
    id: 'rogue_dagger',
    name: 'Rogue\'s Dagger',
    description: 'Increase attack by 4 and energy by 2',
    cost: 3000,
    type: 'equipment',
    effect: {
      type: 'attack',
      value: 4
    },
    image: '🗡️'
  }
];

export const ShopSystem: React.FC<ShopSystemProps> = ({ currentSteps, onPurchase, characterClass }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getClassDiscount = (item: ShopItem): number => {
    if (!characterClass) return 0;
    
    switch (characterClass) {
      case 'Warrior':
        return item.type === 'equipment' ? 0.2 : 0;
      case 'Mage':
        return item.type === 'ability' ? 0.15 : 0;
      case 'Rogue':
        return item.type === 'consumable' ? 0.1 : 0;
      default:
        return 0;
    }
  };

  const getDiscountedPrice = (item: ShopItem): number => {
    const discount = getClassDiscount(item);
    return Math.floor(item.cost * (1 - discount));
  };

  const filteredItems = SHOP_ITEMS.filter(item => 
    selectedCategory === 'all' || item.type === selectedCategory
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
      <Text style={styles.balance}>Steps: {currentSteps}</Text>

      <View style={styles.categoryContainer}>
        {['all', 'consumable', 'equipment', 'ability'].map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.itemsContainer}>
        {filteredItems.map(item => {
          const discountedPrice = getDiscountedPrice(item);
          const canAfford = currentSteps >= discountedPrice;
          
          return (
            <View key={item.id} style={styles.itemContainer}>
              <Text style={styles.itemImage}>{item.image}</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemEffect}>
                  Effect: +{item.effect.value} {item.effect.type}
                </Text>
                <Text style={[
                  styles.itemPrice,
                  !canAfford && styles.itemPriceDisabled
                ]}>
                  {discountedPrice} steps
                  {getClassDiscount(item) > 0 && (
                    <Text style={styles.discountText}>
                      {' '}({Math.round(getClassDiscount(item) * 100)}% off)
                    </Text>
                  )}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.buyButton,
                  !canAfford && styles.buyButtonDisabled
                ]}
                onPress={() => onPurchase(item)}
                disabled={!canAfford}
              >
                <Text style={styles.buyButtonText}>Buy</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
    marginBottom: 10,
  },
  balance: {
    fontSize: 18,
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#27ae60',
  },
  categoryText: {
    color: '#666',
    fontWeight: 'bold',
  },
  categoryTextActive: {
    color: '#fff',
  },
  itemsContainer: {
    maxHeight: 400,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemImage: {
    fontSize: 30,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemEffect: {
    fontSize: 14,
    color: '#27ae60',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  itemPriceDisabled: {
    color: '#95a5a6',
  },
  discountText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  buyButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  buyButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 