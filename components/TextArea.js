import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export const TextArea = ({ 
  placeholder,
  value,
  onChangeText,
  style,
  minHeight = 100,
  maxHeight = 300,
  ...props
}) => {
  return (
    <TextInput
      style={[
        styles.input,
        { minHeight, maxHeight },
        style
      ]}
      placeholder={placeholder}
      placeholderTextColor="#71717a"
      value={value}
      onChangeText={onChangeText}
      multiline
      textAlignVertical="top"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#27272a',
    borderRadius: 6,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
});