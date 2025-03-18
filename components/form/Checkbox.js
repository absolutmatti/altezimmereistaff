import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'react-native-feather';

export const Checkbox = ({ 
  checked, 
  onCheckedChange, 
  label,
  disabled = false,
  style
}) => {
  const handlePress = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.checkboxDisabled
      ]}>
        {checked && <Check width={14} height={14} color="#ffffff" />}
      </View>
      {label && <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>}
    </TouchableOpacity>
  );
};

export const CheckboxGroup = ({ 
  options, 
  selectedValues, 
  onChange, 
  label, 
  description,
  style,
  checkboxStyle
}) => {
  const handleChange = (optionId, checked) => {
    let newValues;
    if (checked) {
      newValues = [...selectedValues, optionId];
    } else {
      newValues = selectedValues.filter(id => id !== optionId);
    }
    onChange(newValues);
  };

  return (
    <View style={[styles.groupContainer, style]}>
      {label && <Text style={styles.groupLabel}>{label}</Text>}
      {description && <Text style={styles.groupDescription}>{description}</Text>}
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <Checkbox
            key={option.id}
            checked={selectedValues.includes(option.id)}
            onCheckedChange={(checked) => handleChange(option.id, checked)}
            label={option.label}
            style={[styles.option, checkboxStyle]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#6366f1',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  checkboxDisabled: {
    borderColor: '#71717a',
    backgroundColor: '#27272a',
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ffffff',
  },
  labelDisabled: {
    color: '#71717a',
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    width: '50%',
    marginBottom: 12,
  },
});