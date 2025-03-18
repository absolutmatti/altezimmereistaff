// utils/utils.js
import { Platform } from 'react-native';

export const getPlatformSpecificValue = (platformValues) => {
  if (!platformValues) return {};
  
  const { ios, android } = platformValues;
  
  if (Platform.OS === 'ios') {
    return ios || {};
  }
  
  if (Platform.OS === 'android') {
    return android || {};
  }
  
  return {};
};