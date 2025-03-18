import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getPlatformSpecificValue } from '../utils/utils';

export const Avatar = ({ size = 'default', source, fallback, style }) => {
  // Berechne die Größe basierend auf der Größenoption
  const sizeValue = getSizeValue(size);
  
  return (
    <View style={[styles.container, { width: sizeValue, height: sizeValue }, style]}>
      {source ? (
        <AvatarImage source={source} />
      ) : (
        <AvatarFallback>{fallback}</AvatarFallback>
      )}
    </View>
  );
};

export const AvatarImage = ({ source }) => {
  const imageSource = typeof source === 'string' 
    ? { uri: source } 
    : source;
    
  return (
    <Image
      source={imageSource}
      style={styles.image}
      resizeMode="cover"
    />
  );
};

export const AvatarFallback = ({ children, style }) => {
  return (
    <View style={[styles.fallback, style]}>
      <Text style={styles.fallbackText}>{children}</Text>
    </View>
  );
};

// Hilfsfunktion zur Berechnung der Größe
const getSizeValue = (size) => {
  switch (size) {
    case 'xs': return 24;
    case 'sm': return 32;
    case 'md': return 40;
    case 'lg': return 48;
    case 'xl': return 56;
    case 'default':
    default: return 40;
  }
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    overflow: 'hidden',
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4b5563',
  },
  fallbackText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});