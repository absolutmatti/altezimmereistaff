import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarDays } from 'react-native-feather';
import { format, parseISO } from 'date-fns';

import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import AvailabilityForm from '../components/calendar/AvailabilityForm';
import CalendarView from '../components/calendar/CalendarView';
import DayDetail from '../components/calendar/DayDetail';
import { mockEvents, mockMeetings, mockSchedule, mockAvailability } from '../utils/mockData';

export default function CalendarScreen() {
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [calendarDays, setCalendarDays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock current user ID
  const currentUserId = "staff1";
  const isOwner = false; // Set to true for owner view

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Process events
        const eventDays = mockEvents.map(event => {
          const date = parseISO(event.date);
          return {
            date,
            dateString: format(date, 'yyyy-MM-dd'),
            hasEvent: true,
            event,
          };
        });

        // Process meetings
        const meetingDays = mockMeetings.map(meeting => {
          const date = parseISO(meeting.date);
          return {
            date,
            dateString: format(date, 'yyyy-MM-dd'),
            hasMeeting: true,
            meeting,
          };
        });

        // Process shifts
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

        // Process availabilities
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

        // Process staff availabilities (for owners)
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

        // Merge all days
        const allDays = [...eventDays, ...meetingDays, ...shiftDays, ...availabilityDays, ...staffAvailabilityDays];

        // Combine days with the same date
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

          // Merge properties
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

        setCalendarDays(Object.values(mergedDays));
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentUserId, isOwner]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowDayDetail(true);
  };

  const handleAddAvailabilityForDay = (date) => {
    setSelectedDate(date);
    setShowDayDetail(false);
    setShowAvailabilityForm(true);
  };

  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Kalender</Text>
            <Button 
              variant="outline" 
              onPress={() => setShowAvailabilityForm(true)}
              icon={<CalendarDays width={16} height={16} color="#ffffff" />}
            >
              Abwesenheit angeben
            </Button>
          </View>

          <Card style={styles.calendarCard}>
            <CardContent style={styles.calendarCardContent}>
              <CalendarView 
                days={calendarDays} 
                onDayClick={handleDayClick} 
                loading={loading} 
              />
            </CardContent>
          </Card>

          {/* Modal for day details */}
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

          {/* Modal for availability form */}
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
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  calendarCard: {
    flex: 1,
  },
  calendarCardContent: {
    padding: 0,
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
    maxHeight: '80%',
  },
});