import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

export default function CalendarView({ days, onDayClick, loading }) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Format marked dates for the calendar
  const markedDates = {};
  
  days.forEach(day => {
    const dots = [];
    
    if (day.hasEvent) {
      dots.push({ key: 'event', color: '#3b82f6' }); // Blue for events
    }
    
    if (day.hasMeeting) {
      dots.push({ key: 'meeting', color: '#8b5cf6' }); // Purple for meetings
    }
    
    if (day.hasShift) {
      dots.push({ key: 'shift', color: '#22c55e' }); // Green for shifts
    }
    
    if (day.hasAvailability) {
      dots.push({ key: 'availability', color: '#ef4444' }); // Red for availability
    }
    
    if (day.hasStaffAvailability) {
      dots.push({ key: 'staffAvailability', color: '#eab308' }); // Yellow for staff availability
    }
    
    markedDates[day.dateString] = {
      dots,
      marked: dots.length > 0
    };
  });
  
  // Mark today's date
  const today = format(new Date(), 'yyyy-MM-dd');
  markedDates[today] = {
    ...markedDates[today],
    selected: true,
    selectedColor: 'rgba(99, 102, 241, 0.2)', // Indigo color with transparency
  };

  // Mark selected date if different from today
  if (selectedDate !== today) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: 'rgba(99, 102, 241, 0.2)',
    };
  }

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    onDayClick(new Date(day.dateString));
  };

  return (
    <Calendar
      current={selectedDate}
      onDayPress={handleDayPress}
      monthFormat={'MMMM yyyy'}
      firstDay={1} // Week starts on Monday
      markedDates={markedDates}
      markingType={'multi-dot'}
      theme={{
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
        textSectionTitleColor: '#a1a1aa',
        textSectionTitleDisabledColor: '#71717a',
        selectedDayBackgroundColor: '#6366f1',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#6366f1',
        dayTextColor: '#ffffff',
        textDisabledColor: '#52525b',
        dotColor: '#6366f1',
        selectedDotColor: '#ffffff',
        arrowColor: '#ffffff',
        disabledArrowColor: '#71717a',
        monthTextColor: '#ffffff',
        indicatorColor: '#6366f1',
        textDayFontWeight: '300',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '500',
        textDayFontSize: 14,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 13
      }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});