import React from 'react';
import { View, Switch as RNSwitch, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

export const Switch = ({ 
  value, 
  onValueChange, 
  label,
  description,
  disabled = false,
  style
}) => {
  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, style]}>
        <View style={styles.content}>
          {label && <Text style={styles.label}>{label}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
        <RNSwitch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ false: '#27272a', true: '#6366f1' }}
          thumbColor={value ? '#ffffff' : '#a1a1aa'}
          ios_backgroundColor="#27272a"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#18181b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  description: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 2,
  },
});