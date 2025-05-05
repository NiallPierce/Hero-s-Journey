import { TextStyle } from 'react-native';

export const colors = {
  // Main theme colors
  primary: '#7B2CBF', // Rich purple
  secondary: '#3A0CA3', // Deep indigo
  accent: '#F72585', // Vibrant pink
  background: '#10002B', // Deepest purple-black
  surface: '#240046', // Dark purple
  card: '#3C096C', // Rich purple-black
  disabled: '#4A4A4A', // Muted gray for disabled states
  
  // Text colors
  text: {
    primary: '#E9ECEF', // Off-white
    secondary: '#CED4DA', // Light gray
    accent: '#FF9E00', // Warm gold
    dark: '#212529', // Dark gray
  },
  
  // Status colors
  status: {
    success: '#4CC9F0', // Bright cyan
    warning: '#FF9E00', // Warm orange
    error: '#F72585', // Vibrant pink
    info: '#4361EE', // Bright blue
  },
  
  // UI elements
  border: '#5A189A', // Medium purple
  divider: '#3C096C', // Rich purple-black
  overlay: 'rgba(16, 0, 43, 0.9)', // Dark purple overlay
  
  // Rank colors - Gradient progression from cool to warm
  ranks: {
    novice: '#4361EE', // Bright blue
    apprentice: '#3A0CA3', // Deep indigo
    adventurer: '#4CC9F0', // Bright cyan
    explorer: '#4895EF', // Sky blue
    hero: '#F72585', // Vibrant pink
    champion: '#B5179E', // Deep pink
    master: '#FF9E00', // Warm orange
    grandmaster: '#FFD60A', // Bright yellow
    legend: '#FFD60A', // Bright yellow
    mythic: '#F72585', // Vibrant pink
    divine: '#B5179E', // Deep pink
    celestial: '#4CC9F0', // Bright cyan
    cosmic: '#3A0CA3', // Deep indigo
    eternal: '#4361EE', // Bright blue
    transcendent: '#F72585', // Vibrant pink
    omnipotent: '#FFD60A', // Bright yellow
  }
};

export const typography = {
  fontFamily: 'System',
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  // Add direct access to font sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  styles: {
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text.primary,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    subtitle: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.text.primary,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.text.primary,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.secondary,
    },
    small: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.text.secondary,
    },
  } as Record<string, TextStyle>,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
};

export const shadows = {
  small: {
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  medium: {
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  large: {
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
}; 