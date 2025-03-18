import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  SafeAreaView,
  Platform
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight 
} from 'react-native-feather';

import { Card } from '../components/Card';
import { Button } from '../components/Button';
import DayDetail from '../components/calendar/DayDetail';
import AvailabilityForm from '../components/calendar/AvailabilityForm';

// Beispiel-Daten
import { 
  mockEvents, 
  mockMeetings, 
  mockSchedule, 
  mockAvailability 
} from '../utils/mockData';

export default function CalendarScreen() {
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [calendarDays, setCalendarDays] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Beispiel-Nutzer-ID
  const currentUserId = "staff1";
  const isOwner = false; // Auf true setzen für die Eigentümer-Ansicht

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      // API-Aufruf simulieren
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ereignisse verarbeiten
      const eventDays = mockEvents.map(event => {
        const date = parseISO(event.date);
        return {
          date,
          dateString: format(date, 'yyyy-MM-dd'),
          hasEvent: true,
          event,
        };
      });

      // Besprechungen verarbeiten
      const meetingDays = mockMeetings.map(meeting => {
        const date = parseISO(meeting.date);
        return {
          date,
          dateString: format(date, 'yyyy-MM-dd'),
          hasMeeting: true,
          meeting,
        };
      });

      // Dienste verarbeiten
      const shiftDays = [];
      mockSchedule.days.forEach(day => {
        const userShifts = day.shifts.filter(shift => shift.staff?.id === currentUserId);
        if (userShifts.length > 0) {
          const date = parseISO(day.date);
          shiftDays.push({
            date,
            dateString: format(date, 'yyyy-MM-dd'),
            hasShift: true,
            shifts: userShifts,
          });
        }
      });

      // Abwesenheiten verarbeiten
      const availabilityDays = mockAvailability
        .filter(a => a.userId === currentUserId)
        .map(availability => {
          const date = parseISO(availability.date);
          return {
            date,
            dateString: format(date, 'yyyy-MM-dd'),
            hasAvailability: true,
            availability,
          };
        });

      // Mitarbeiter-Abwesenheiten verarbeiten (für Eigentümer)
      const staffAvailabilityDays = isOwner
        ? mockAvailability
            .filter(a => a.userId !== currentUserId)
            .map(availability => {
              const date = parseISO(availability.date);
              return {
                date,
                dateString: format(date, 'yyyy-MM-dd'),
                hasStaffAvailability: true,
                staffAvailability: availability,
              };
            })
        : [];

      // Alle Tage zusammenführen
      const allDays = [...eventDays, ...meetingDays, ...shiftDays, ...availabilityDays, ...staffAvailabilityDays];

      // Tage mit demselben Datum kombinieren
      const mergedDays = {};

      allDays.forEach(day => {
        if (!mergedDays[day.dateString]) {
          mergedDays[day.dateString] = {
            date: day.date,
            dateString: day.dateString,
            hasEvent: false,
            hasMeeting: false,
            hasShift: false,
            hasAvailability: false,
            hasStaffAvailability: false,
          };
        }

        // Eigenschaften zusammenführen
        if (day.hasEvent) {
          mergedDays[day.dateString].hasEvent = true;
          mergedDays[day.dateString].event = day.event;
        }

        if (day.hasMeeting) {
          mergedDays[day.dateString].hasMeeting = true;
          mergedDays[day.dateString].meeting = day.meeting;
        }

        if (day.hasShift) {
          mergedDays[day.dateString].hasShift = true;
          mergedDays[day.dateString].shifts = day.shifts;
        }

        if (day.hasAvailability) {
          mergedDays[day.dateString].hasAvailability = true;
          mergedDays[day.dateString].availability = day.availability;
        }

        if (day.hasStaffAvailability) {
          mergedDays[day.dateString].hasStaffAvailability = true;
          mergedDays[day.dateString].staffAvailability = day.staffAvailability;
        }
      });

      // Markierte Tage für den Kalender formatieren
      const markedDatesObj = {};
      
      Object.entries(mergedDays).forEach(([dateString, day]) => {
        const dots = [];
        
        if (day.hasEvent) {
          dots.push({ color: '#3b82f6', key: 'event' }); // Blau für Events
        }
        
        if (day.hasMeeting) {
          dots.push({ color: '#8b5cf6', key: 'meeting' }); // Lila für Besprechungen
        }
        
        if (day.hasShift) {
          dots.push({ color: '#22c55e', key: 'shift' }); // Grün für Dienste
        }
        
        if (day.hasAvailability) {
          dots.push({ color: '#ef4444', key: 'availability' }); // Rot für Abwesenheiten
        }
        
        if (day.hasStaffAvailability) {
          dots.push({ color: '#eab308', key: 'staffAvailability' }); // Gelb für Mitarbeiter-Abwesenheiten
        }
        
        markedDatesObj[dateString] = {
          dots,
          marked: dots.length > 0
        };
      });
      
      // Heutiges Datum markieren
      const today = format(new Date(), 'yyyy-MM-dd');
      markedDatesObj[today] = {
        ...markedDatesObj[today],
        selected: true,
        selectedColor: 'rgba(99, 102, 241, 0.2)', // Indigo Farbe mit Transparenz
      };
      
      setMarkedDates(markedDatesObj);
      setCalendarDays(Object.values(mergedDays));
    } catch (error) {
      console.error('Fehler beim Laden der Kalenderdaten:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(parseISO(day.dateString));
    setShowDayDetail(true);
  };

  const handleAddAvailabilityForDay = (date) => {
    setSelectedDate(date);
    setShowDayDetail(false);
    setShowAvailabilityForm(true);
  };

  const navigateToToday = () => {
    const today = new Date();
    setCurrentMonth(format(today, 'yyyy-MM-dd'));
  };

  const renderCustomHeader = (date) => {
    const monthName = format(date, 'MMMM yyyy', { locale: de });
    
    return (
      <View style={styles.customHeader}>
        <TouchableOpacity
          onPress={() => date.setMonth(date.getMonth() - 1)}
          style={styles.headerButton}
        >
          <ChevronLeft width={20} height={20} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <TouchableOpacity onPress={navigateToToday} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Heute</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{monthName}</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => date.setMonth(date.getMonth() + 1)}
          style={styles.headerButton}
        >
          <ChevronRight width={20} height={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Kalender</Text>
            <Button 
              variant="outline" 
              onPress={() => setShowAvailabilityForm(true)}
              icon={<CalendarDays width={16} height={16} color="#ffffff" />}
            >
              Abwesenheit
            </Button>
          </View>
          
          <Card style={styles.calendarCard}>
            <Calendar
              current={currentMonth}
              onDayPress={handleDayPress}
              monthFormat={'MMMM yyyy'}
              renderHeader={renderCustomHeader}
              firstDay={1} // Woche beginnt am Montag
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
          </Card>
        </ScrollView>
        
        {/* Modal für Tagesdetails */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDayDetail}
          onRequestClose={() => setShowDayDetail(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedDate && (
                <DayDetail
                  date={selectedDate}
                  calendarDays={calendarDays}
                  onAddAvailability={handleAddAvailabilityForDay}
                  onClose={() => setShowDayDetail(false)}
                />
              )}
            </View>
          </View>
        </Modal>
        
        {/* Modal für Abwesenheitsformular */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAvailabilityForm}
          onRequestClose={() => setShowAvailabilityForm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <AvailabilityForm 
                onSuccess={() => setShowAvailabilityForm(false)} 
                initialDate={selectedDate}
                onClose={() => setShowAvailabilityForm(false)}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  calendarCard: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 0,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(39, 39, 42, 0.8)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  todayButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    marginBottom: 8,
  },
  todayButtonText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingTop: 8,
    // Passt sich an größere iPhones und Dynamic Island an
    ...Platform.select({
      ios: {
        paddingBottom: 34
      }
    }),
    maxHeight: '80%',
  },
});