import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';
import { Card } from './Card';

interface ShopItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  isOwned: boolean;
  onPress: () => void;
}

export const ShopItem: React.FC<ShopItemProps> = ({
  name,
  description,
  price,
  image,
  isOwned,
  onPress,
}) => {
  return (
    <Card variant="elevated">
      <TouchableOpacity
        onPress={onPress}
        disabled={isOwned}
        style={[
          styles.container,
          isOwned && styles.ownedContainer,
        ]}
      >
        <Image source={image} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{name}</Text>
            <Text style={[styles.price, isOwned && styles.ownedPrice]}>
              {isOwned ? 'Owned' : `${price} coins`}
            </Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.sm,
  },
  ownedContainer: {
    opacity: 0.7,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: spacing.xs,
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  price: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    fontWeight: 'bold',
  },
  ownedPrice: {
    color: colors.text.secondary,
  },
  description: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
}); 