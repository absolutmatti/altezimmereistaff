import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { format, addDays, isAfter } from 'date-fns';
import { de } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar as CalendarIcon, Loader2 } from 'react-native-feather';

import { Button } from '../Button';

export default function AvailabilityForm({ onSuccess, initialDate = null, onClose }) {
  const today = new Date();
  const [startDate, setStartDate] = useState(initialDate || today);
  const [endDate, setEndDate] = useState(addDays(startDate, 1));
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Für Date Picker
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Ganzen Tag Option
  const [isAllDay, setIsAllDay] = useState(true);
  
  // Start- und Endzeit für teilweise Abwesenheit
  const [startTime, setStartTime] = useState(new Date(today.setHours(9, 0, 0, 0)));
  const [endTime, setEndTime] = useState(new Date(today.setHours(17, 0, 0, 0)));
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Validierung
  useEffect(() => {
    // Stelle sicher, dass endDate nach startDate liegt
    if (!isAfter(endDate, startDate)) {
      setEndDate(addDays(startDate, 1));
    }
  }, [startDate]);

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
  
  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };
  
  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Grund für deine Abwesenheit an.');
      return;
    }

    setIsSubmitting(true);

    try {
      // API-Aufruf simulieren
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Erfolgsmeldung
      Alert.alert(
        'Abwesenheit gespeichert',
        'Deine Abwesenheit wurde erfolgreich gespeichert.',
        [{ text: 'OK', onPress: onSuccess }]
      );
    } catch (error) {
      console.error('Fehler beim Speichern der Abwesenheit:', error);
      
      Alert.alert(
        'Fehler',
        'Deine Abwesenheit konnte nicht gespeichert werden.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Abwesenheit angeben</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>
        Gib hier an, wann du nicht verfügbar bist, z.B. wegen Urlaub oder anderen Terminen.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ganztägig</Text>
        <Switch
          value={isAllDay}
          onValueChange={setIsAllDay}
          trackColor={{ false: '#27272a', true: '#6366f1' }}
          thumbColor={isAllDay ? '#ffffff' : '#a1a1aa'}
          ios_backgroundColor="#27272a"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Startdatum</Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowStartDatePicker(true)}
        >
          <CalendarIcon width={16} height={16} color="#a1a1aa" style={styles.inputIcon} />
          <Text style={styles.dateText}>
            {format(startDate, 'EEEE, d. MMMM yyyy', { locale: de })}
          </Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartDateChange}
            minimumDate={today}
            textColor="#ffffff" // für iOS
          />
        )}
      </View>

      {!isAllDay && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Startzeit</Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text style={styles.dateText}>
              {format(startTime, 'HH:mm', { locale: de })} Uhr
            </Text>
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartTimeChange}
              textColor="#ffffff" // für iOS
              is24Hour={true}
            />
          )}
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Enddatum</Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowEndDatePicker(true)}
        >
          <CalendarIcon width={16} height={16} color="#a1a1aa" style={styles.inputIcon} />
          <Text style={styles.dateText}>
            {format(endDate, 'EEEE, d. MMMM yyyy', { locale: de })}
          </Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndDateChange}
            minimumDate={startDate}
            textColor="#ffffff" // für iOS
          />
        )}
      </View>

      {!isAllDay && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Endzeit</Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text style={styles.dateText}>
              {format(endTime, 'HH:mm', { locale: de })} Uhr
            </Text>
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndTimeChange}
              textColor="#ffffff" // für iOS
              is24Hour={true}
            />
          )}
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Grund</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Urlaub, Arztbesuch, etc."
          placeholderTextColor="#71717a"
          value={reason}
          onChangeText={setReason}
          multiline={true}
          numberOfLines={3}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          variant="outline"
          style={styles.cancelButton}
          onPress={onClose}
          disabled={isSubmitting}
        >
          Abbrechen
        </Button>
        <Button
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
          icon={isSubmitting ? <Loader2 width={16} height={16} color="#ffffff" /> : null}
        >
          {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(39, 39, 42, 0.8)',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 20,
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
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#27272a',
    borderRadius: 6,
  },
  inputIcon: {
    marginRight: 8,
  },
  dateText: {
    color: '#ffffff',
    fontSize: 14,
  },
  textInput: {
    padding: 12,
    backgroundColor: '#27272a',
    borderRadius: 6,
    color: '#ffffff',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});