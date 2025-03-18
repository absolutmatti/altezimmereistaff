import React from 'react';
import { View, StyleSheet } from 'react-native';

export const ProgressBar = ({ progress, height = 8, color = '#6366f1', style }) => {
  return (
    <View style={[styles.container, { height }, style]}>
      <View 
        style={[
          styles.progress, 
          { 
            width: `${Math.min(Math.max(0, progress), 100)}%`,
            backgroundColor: color 
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#27272a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});