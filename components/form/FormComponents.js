import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const FormItem = ({ children, style }) => {
  return <View style={[styles.formItem, style]}>{children}</View>;
};

export const FormLabel = ({ children, style }) => {
  return <Text style={[styles.formLabel, style]}>{children}</Text>;
};

export const FormDescription = ({ children, style }) => {
  return <Text style={[styles.formDescription, style]}>{children}</Text>;
};

export const FormMessage = ({ children, error, style }) => {
  if (!error && !children) return null;
  
  return (
    <Text style={[styles.formMessage, style]}>
      {error ? error.message : children}
    </Text>
  );
};

export const FormSection = ({ children, style }) => {
  return <View style={[styles.formSection, style]}>{children}</View>;
};

export const FormDivider = ({ style }) => {
  return <View style={[styles.formDivider, style]} />;
};

export const FormActions = ({ children, style }) => {
  return <View style={[styles.formActions, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  formItem: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  formDescription: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 8,
  },
  formMessage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ef4444',
    marginTop: 4,
  },
  formSection: {
    marginBottom: 24,
  },
  formDivider: {
    height: 1,
    backgroundColor: '#27272a',
    marginVertical: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
});