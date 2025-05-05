import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 5;

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [animation] = useState(new Animated.Value(0));

  const tabs = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'character', icon: 'account', label: 'Character' },
    { id: 'quests', icon: 'sword', label: 'Quests' },
    { id: 'inventory', icon: 'backpack', label: 'Inventory' },
    { id: 'shop', icon: 'store', label: 'Shop' },
  ];

  const handleTabPress = (tabId: string) => {
    const index = tabs.findIndex(tab => tab.id === tabId);
    Animated.spring(animation, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    onTabChange(tabId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.tabContent,
                activeTab === tab.id && styles.activeTab,
              ]}
            >
              <Icon
                name={tab.icon}
                size={24}
                color={activeTab === tab.id ? colors.accent : colors.text.secondary}
                style={styles.icon}
              />
              <Animated.Text
                style={[
                  styles.label,
                  activeTab === tab.id && styles.activeLabel,
                ]}
              >
                {tab.label}
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [{ translateX: animation }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.large,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  activeTab: {
    backgroundColor: 'rgba(247, 37, 133, 0.1)',
  },
  icon: {
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.small,
    color: colors.text.secondary,
  },
  activeLabel: {
    color: colors.accent,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: TAB_WIDTH,
    height: 3,
    backgroundColor: colors.accent,
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
    ...shadows.medium,
  },
}); 