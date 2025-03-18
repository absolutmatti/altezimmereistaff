import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, X } from 'react-native-feather';

export const MediaUpload = ({ 
  value, 
  onChange, 
  label,
  allowTypes = ['image'],
  style 
}) => {
  
  const handlePickMedia = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Wir benötigen die Berechtigung, um deine Medienbibliothek zu verwenden');
      return;
    }
    
    // Determine media type options based on allowTypes
    const mediaTypes = 
      allowTypes.includes('video') && allowTypes.includes('image') 
        ? ImagePicker.MediaTypeOptions.All
        : allowTypes.includes('video')
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images;
    
    // Launch media picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onChange(result.assets[0].uri);
    }
  };
  
  const handleRemoveMedia = () => {
    onChange(null);
  };
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      {value ? (
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: value }} 
            style={styles.preview} 
            resizeMode="cover" 
          />
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={handleRemoveMedia}
            activeOpacity={0.8}
          >
            <X width={16} height={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={handlePickMedia}
          activeOpacity={0.7}
        >
          <ImageIcon width={24} height={24} color="#71717a" />
          <Text style={styles.uploadText}>Klicke zum Hochladen</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18181b',
    height: 120,
    borderWidth: 2,
    borderColor: '#27272a',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 12,
    color: '#71717a',
  },
  previewContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});