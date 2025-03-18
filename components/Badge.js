import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Badge = ({ children, variant = 'default', style, textStyle }) => {
  const variantStyle = getVariantStyle(variant);
  
  return (
    <View style={[styles.badge, variantStyle.container, style]}>
      <Text style={[styles.badgeText, variantStyle.text, textStyle]}>
        {children}
      </Text>
    </View>
  );
};

const getVariantStyle = (variant) => {
  switch (variant) {
    case 'primary':
      return {
        container: { backgroundColor: '#6366f1' },
        text: { color: '#ffffff' }
      };
    case 'secondary':
      return {
        container: { backgroundColor: '#27272a' },
        text: { color: '#d4d4d8' }
      };
    case 'destructive':
      return {
        container: { backgroundColor: '#ef4444' },
        text: { color: '#ffffff' }
      };
    case 'outline':
      return {
        container: { 
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#6366f1' 
        },
        text: { color: '#6366f1' }
      };
    case 'default':
    default:
      return {
        container: { backgroundColor: '#6366f1' },
        text: { color: '#ffffff' }
      };
  }
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});