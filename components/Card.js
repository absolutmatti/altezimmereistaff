import React from 'react';
import { View, StyleSheet } from 'react-native';
import { getPlatformSpecificValue } from '../utils/utils';

export const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export const CardHeader = ({ children, style }) => {
  return <View style={[styles.cardHeader, style]}>{children}</View>;
};

export const CardContent = ({ children, style }) => {
  return <View style={[styles.cardContent, style]}>{children}</View>;
};

export const CardFooter = ({ children, style }) => {
  return <View style={[styles.cardFooter, style]}>{children}</View>;
};

export const CardTitle = ({ children, style, ...props }) => {
  return <View style={[styles.cardTitle, style]} {...props}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#18181b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    overflow: 'hidden',
    marginBottom: 16,
    ...getPlatformSpecificValue({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
});