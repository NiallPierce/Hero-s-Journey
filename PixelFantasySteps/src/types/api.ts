export interface UserProfile {
    _id: string;
    username: string;
    email: string;
    character: {
      level: number;
      experience: number;
      class: string;
      appearance: Record<string, any>;
      stats: {
        health: number;
        maxHealth: number;
        attack: number;
        defense: number;
        energy: number;
      };
    };
    steps: {
      total: number;
      daily: number;
      lastUpdated: string;
    };
    inventory: Array<{
      itemId: string;
      quantity: number;
    }>;
    achievements: Array<{
      id: string;
      unlockedAt: string;
    }>;
  }
  
  export interface StepUpdateResponse {
    steps: {
      total: number;
      daily: number;
      lastUpdated: string;
    };
    character: {
      level: number;
      experience: number;
      stats: {
        health: number;
        maxHealth: number;
        attack: number;
        defense: number;
        energy: number;
      };
    };
    achievements: Array<{
      id: string;
      unlockedAt: string;
    }>;
  }
  
  export interface InventoryItem {
    _id: string;
    name: string;
    description: string;
    type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'special';
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    stats: {
      health: number;
      attack: number;
      defense: number;
      energy: number;
    };
    price: number;
    image: string;
    levelRequirement: number;
    classRestriction: 'warrior' | 'mage' | 'rogue' | 'healer' | 'all';
    effects: Array<{
      type: 'buff' | 'debuff' | 'heal' | 'damage';
      value: number;
      duration: number;
    }>;
  } 