import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';
import { Loader2 } from 'react-native-feather';

import { Button } from '../Button';

export default function ChangePasswordForm({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form validation errors
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    // Reset all errors
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    
    // Validate current password
    if (!currentPassword) {
      setCurrentPasswordError('Bitte gib dein aktuelles Passwort ein.');
      isValid = false;
    }
    
    // Validate new password
    if (!newPassword) {
      setNewPasswordError('Bitte gib ein neues Passwort ein.');
      isValid = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError('Das neue Passwort muss mindestens 8 Zeichen lang sein.');
      isValid = false;
    }
    
    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Die Passwörter stimmen nicht überein.');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Hier würde die tatsächliche Passwortänderungslogik implementiert werden
      console.log("Ändere Passwort mit:", { currentPassword, newPassword, confirmPassword });

      // API-Aufruf simulieren
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Erfolgsmeldung
      Alert.alert(
        "Passwort geändert",
        "Dein Passwort wurde erfolgreich aktualisiert.",
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate('Profile')
          }
        ]
      );
    } catch (error) {
      console.error("Password change error:", error);
      Alert.alert(
        "Fehler beim Ändern des Passworts",
        "Bitte überprüfe dein aktuelles Passwort und versuche es erneut."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Aktuelles Passwort</Text>
        <TextInput
          style={[
            styles.input,
            currentPasswordError ? styles.inputError : null
          ]}
          placeholder="••••••••"
          placeholderTextColor="#71717a"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        {currentPasswordError ? <Text style={styles.errorText}>{currentPasswordError}</Text> : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Neues Passwort</Text>
        <TextInput
          style={[
            styles.input,
            newPasswordError ? styles.inputError : null
          ]}
          placeholder="••••••••"
          placeholderTextColor="#71717a"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Text style={styles.helperText}>Mindestens 8 Zeichen</Text>
        {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Passwort bestätigen</Text>
        <TextInput
          style={[
            styles.input,
            confirmPasswordError ? styles.inputError : null
          ]}
          placeholder="••••••••"
          placeholderTextColor="#71717a"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
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