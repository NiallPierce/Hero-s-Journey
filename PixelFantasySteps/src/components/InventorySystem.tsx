import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Item types and interfaces
interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats: {
    attack?: number;
    defense?: number;
    health?: number;
    speed?: number;
  };
  description: string;
  image: string;
}

interface EquipmentSlots {
  weapon: Item | null;
  armor: Item | null;
  accessory: Item | null;
}

const InventorySystem: React.FC = () => {
  const [inventory, setInventory] = useState<Item[]>([]);
  const [equipped, setEquipped] = useState<EquipmentSlots>({
    weapon: null,
    armor: null,
    accessory: null,
  });
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Load inventory and equipped items from storage
  useEffect(() => {
    loadInventory();
    loadEquippedItems();
  }, []);

  const loadInventory = async () => {
    try {
      const storedInventory = await AsyncStorage.getItem('inventory');
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  const loadEquippedItems = async () => {
    try {
      const storedEquipped = await AsyncStorage.getItem('equippedItems');
      if (storedEquipped) {
        setEquipped(JSON.parse(storedEquipped));
      }
    } catch (error) {
      console.error('Error loading equipped items:', error);
    }
  };

  const saveInventory = async (newInventory: Item[]) => {
    try {
      await AsyncStorage.setItem('inventory', JSON.stringify(newInventory));
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const saveEquippedItems = async (newEquipped: EquipmentSlots) => {
    try {
      await AsyncStorage.setItem('equippedItems', JSON.stringify(newEquipped));
    } catch (error) {
      console.error('Error saving equipped items:', error);
    }
  };

  const equipItem = (item: Item) => {
    const newEquipped = { ...equipped };
    newEquipped[item.type] = item;
    setEquipped(newEquipped);
    saveEquippedItems(newEquipped);

    // Remove item from inventory
    const newInventory = inventory.filter(i => i.id !== item.id);
    setInventory(newInventory);
    saveInventory(newInventory);
  };

  const unequipItem = (slot: keyof EquipmentSlots) => {
    if (!equipped[slot]) return;

    const item = equipped[slot];
    const newEquipped = { ...equipped, [slot]: null };
    setEquipped(newEquipped);
    saveEquippedItems(newEquipped);

    // Add item back to inventory
    const newInventory = [...inventory, item!];
    setInventory(newInventory);
    saveInventory(newInventory);
  };

  const getRarityColor = (rarity: Item['rarity']) => {
    const colors = {
      common: '#9d9d9d',
      uncommon: '#1eff00',
      rare: '#0070dd',
      epic: '#a335ee',
      legendary: '#ff8000',
    };
    return colors[rarity];
  };

  const renderEquipmentSlot = (slot: keyof EquipmentSlots, label: string) => (
    <View style={styles.equipmentSlot}>
      <Text style={styles.slotLabel}>{label}</Text>
      {equipped[slot] ? (
        <TouchableOpacity
          style={[styles.itemContainer, { borderColor: getRarityColor(equipped[slot]!.rarity) }]}
          onPress={() => unequipItem(slot)}
        >
          <Text style={[styles.itemName, { color: getRarityColor(equipped[slot]!.rarity) }]}>
            {equipped[slot]!.name}
          </Text>
          <Text style={styles.itemStats}>
            {Object.entries(equipped[slot]!.stats)
              .map(([stat, value]) => `${stat}: +${value}`)
              .join('\n')}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.emptySlot}>
          <Text style={styles.emptySlotText}>Empty</Text>
        </View>
      )}
    </View>
  );

  const renderInventoryItem = (item: Item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.itemContainer, { borderColor: getRarityColor(item.rarity) }]}
      onPress={() => setSelectedItem(item)}
    >
      <Text style={[styles.itemName, { color: getRarityColor(item.rarity) }]}>
        {item.name}
      </Text>
      <Text style={styles.itemType}>{item.type}</Text>
      <Text style={styles.itemStats}>
        {Object.entries(item.stats)
          .map(([stat, value]) => `${stat}: +${value}`)
          .join('\n')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      
      <View style={styles.equipmentSection}>
        <Text style={styles.sectionTitle}>Equipment</Text>
        <View style={styles.equipmentSlots}>
          {renderEquipmentSlot('weapon', 'Weapon')}
          {renderEquipmentSlot('armor', 'Armor')}
          {renderEquipmentSlot('accessory', 'Accessory')}
        </View>
      </View>

      <View style={styles.inventorySection}>
        <Text style={styles.sectionTitle}>Items</Text>
        <ScrollView style={styles.inventoryGrid}>
          {inventory.map(renderInventoryItem)}
        </ScrollView>
      </View>

      {selectedItem && (
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, { color: getRarityColor(selectedItem.rarity) }]}>
            {selectedItem.name}
          </Text>
          <Text style={styles.itemDescription}>{selectedItem.description}</Text>
          <Text style={styles.itemStats}>
            {Object.entries(selectedItem.stats)
              .map(([stat, value]) => `${stat}: +${value}`)
              .join('\n')}
          </Text>
          <TouchableOpacity
            style={styles.equipButton}
            onPress={() => {
              equipItem(selectedItem);
              setSelectedItem(null);
            }}
          >
            <Text style={styles.equipButtonText}>Equip</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  equipmentSection: {
    marginBottom: 16,
  },
  equipmentSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  equipmentSlot: {
    flex: 1,
    margin: 4,
  },
  slotLabel: {
    color: '#ffffff',
    marginBottom: 4,
  },
  emptySlot: {
    height: 100,
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlotText: {
    color: '#666666',
  },
  inventorySection: {
    flex: 1,
  },
  inventoryGrid: {
    flex: 1,
  },
  itemContainer: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#2a2a2a',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemType: {
    color: '#999999',
    marginBottom: 4,
  },
  itemStats: {
    color: '#cccccc',
    fontSize: 12,
  },
  itemDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  itemDescription: {
    color: '#cccccc',
    marginVertical: 8,
  },
  equipButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  equipButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default InventorySystem; 