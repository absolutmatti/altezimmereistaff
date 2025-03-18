import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Loader2, Upload } from 'react-native-feather';

import { Button } from '../Button';
import { Avatar, AvatarFallback } from '../Avatar';

// Mock Benutzerdaten - in einer echten App würden diese vom Authentifizierungssystem kommen
const mockProfileData = {
  name: "Max Mustermann",
  email: "max@altezimmerei.de",
  phone: "+49 123 4567890",
  profileImage: "https://ui-avatars.com/api/?name=Max+Mustermann"
};

export default function EditProfileForm({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [initialProfile, setInitialProfile] = useState(null);
  
  // Form validation
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    // Berechtigungen für den Fotomedienzugriff anfordern
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Wir benötigen Zugriff auf deine Fotos, um ein Profilbild festzulegen!');
        }
      }
    })();

    // API-Aufruf simulieren
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // In einer echten App wäre dies ein API-Aufruf, um das Benutzerprofil zu erhalten
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Demo-Daten
        const profile = mockProfileData;
        setInitialProfile(profile);
        setProfileImage(profile.profileImage);
        setName(profile.name);
        setPhone(profile.phone || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert(
          "Fehler",
          "Profildaten konnten nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    let isValid = true;
    
    // Validate name
    if (!name.trim() || name.trim().length < 2) {
      setNameError("Der Name muss mindestens 2 Zeichen lang sein.");
      isValid = false;
    } else {
      setNameError("");
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Hier würde die tatsächliche Aktualisierungslogik implementiert werden
      console.log("Aktualisiere Profil mit:", { name, phone, profileImage });

      // API-Aufruf simulieren
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Erfolgsmeldung
      Alert.alert(
        "Profil aktualisiert",
        "Deine Profilinformationen wurden erfolgreich aktualisiert.",
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate('Profile')
          }
        ]
      );
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert(
        "Fehler beim Aktualisieren",
        "Bitte versuche es später erneut oder kontaktiere den Support."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Fehler', 'Beim Auswählen des Bildes ist ein Fehler aufgetreten.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Initialen für Avatar Fallback erstellen
  const initials = initialProfile?.name
    .split(" ")
    .map(n => n[0])
    .join("") || "";

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar 
          size="xl" 
          source={profileImage}
          fallback={initials || <Upload width={32} height={32} color="#ffffff" />}
          style={styles.avatar}
        />
        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={handleImageUpload}
        >
          <Text style={styles.imageUploadButtonText}>Profilbild ändern</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[
            styles.input,
            nameError ? styles.inputError : null
          ]}
          placeholder="Dein Name"
          placeholderTextColor="#71717a"
          value={name}
          onChangeText={setName}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Telefonnummer (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="+49 123 4567890"
          placeholderTextColor="#71717a"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Text style={styles.helperText}>Wird nur für interne Kommunikation verwendet</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          variant="outline"
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          Abbrechen
        </Button>
        <Button
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
          icon={isSubmitting ? <Loader2 width={16} height={16} color="#ffffff" /> : null}
        >
          {isSubmitting ? 'Speichern...' : 'Speichern'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 8,
  },
  imageUploadButton: {
    padding: 8,
  },
  imageUploadButtonText: {
    color: '#6366f1',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#27272a',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});