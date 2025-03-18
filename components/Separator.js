import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Separator = ({ style }) => {
  return <View style={[styles.separator, style]} />;
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#27272a',
    width: '100%',
  },
});