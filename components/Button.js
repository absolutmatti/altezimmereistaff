import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export const buttonVariants = {
  variant: {
    default: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
    },
    destructive: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#d4d4d8',
      color: '#18181b',
    },
    secondary: {
      backgroundColor: '#f4f4f5',
      color: '#18181b',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#ffffff',
    },
    link: {
      backgroundColor: 'transparent',
      color: '#6366f1',
    },
  },
  size: {
    default: {
      height: 36,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    sm: {
      height: 32,
      paddingHorizontal: 12,
      fontSize: 12,
      borderRadius: 6,
    },
    lg: {
      height: 40,
      paddingHorizontal: 32,
      borderRadius: 6,
    },
    icon: {
      height: 36,
      width: 36,
      padding: 0,
    },
  },
};

export const Button = ({
  style,
  variant = 'default',
  size = 'default',
  children,
  disabled = false,
  onPress,
  icon,
  ...props
}) => {
  const variantStyle = buttonVariants.variant[variant] || buttonVariants.variant.default;
  const sizeStyle = buttonVariants.size[size] || buttonVariants.size.default;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: variantStyle.backgroundColor },
        sizeStyle,
        variant === 'outline' && styles.outlineButton,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      {typeof children === 'string' ? (
        <Text 
          style={[
            styles.text, 
            { color: variantStyle.color }
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    width: 16,
    height: 16,
  },
});