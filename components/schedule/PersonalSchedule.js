import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SectionList
} from 'react-native';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  AlertCircle 
} from 'react-native-feather';

import { Card, CardContent, CardHeader } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { mockSchedule, mockAvailability } from '../../utils/mockData';

// Farbenzuordnung für Diensttypen
const shiftTypeColors = {
  "Kasse": "#3b82f6",      // Blau
  "Garderobe": "#8b5cf6",  // Lila
  "Springer": "#eab308",   // Gelb
  "Bar": "#22c55e",        // Grün
  "Theke": "#6366f1",      // Indigo
  "Security": "#ef4444",   // Rot
  "Reinigung": "#6b7280",  // Grau
  "Grill": "#f97316"       // Orange
};

export default function PersonalSchedule() {
  const [loading, setLoading] = useState(true);
  const [myShifts, setMyShifts] = useState([]);
  const [myAvailability, setMyAvailability] = useState([]);
  const [shiftsByMonth, setShiftsByMonth] = useState({});

  // Mock current user ID
  const currentUserId = "staff1";

  useEffect(() => {
    const fetchPersonalSchedule = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get all shifts for the current user
        const allShifts = [];
        mockSchedule.days.forEach(day => {
          day.shifts.forEach(shift => {
            if (shift.staff?.id === currentUserId) {
              // Add date to shift for easy sorting
              allShifts.push({
                ...shift,
                date: day.date,
                hasEvent: day.hasEvent,
                eventId: day.eventId
              });
            }
          });
        });

        // Sort shifts by date and time
        allShifts.sort((a, b) => {
          const dateA = new Date(a.date + "T" + a.startTime);
          const dateB = new Date(b.date + "T" + b.startTime);
          return dateA.getTime() - dateB.getTime();
        });

        setMyShifts(allShifts);

        // Group shifts by month
        const groupedShifts = {};
        allShifts.forEach(shift => {
          const monthYear = format(new Date(shift.date), 'MMMM yyyy', { locale: de });
          if (!groupedShifts[monthYear]) {
            groupedShifts[monthYear] = [];
          }
          groupedShifts[monthYear].push(shift);
        });
        setShiftsByMonth(groupedShifts);

        // Get availability for the current user
        const availability = mockAvailability.filter(a => a.userId === currentUserId);
        setMyAvailability(availability);
      } catch (error) {
        console.error('Error fetching personal schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalSchedule();
  }, []);

  const navigateToEvent = (eventId) => {
    // Hier würden Sie zur Event-Detail-Seite navigieren
    console.log(`Navigiere zu Event: ${eventId}`);
    // Beispiel für die Navigation:
    // navigation.navigate('EventDetail', { eventId });
  };

  if (loading) {
    return (
      <Card>
        <CardContent style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </CardContent>
      </Card>
    );
  }

  // Prepare data for SectionList
  const sections = Object.keys(shiftsByMonth).map(monthYear => ({
    title: monthYear,
    data: shiftsByMonth[monthYear]
  }));

  const renderShiftItem = ({ item: shift }) => (
    <View style={styles.shiftItem}>
      <View style={styles.shiftDetails}>
        <View style={styles.shiftHeader}>
          <Badge 
            style={[
              styles.shiftTypeBadge, 
              { backgroundColor: shiftTypeColors[shift.type] || '#6b7280' }
            ]}
          >
            {shift.type}
          </Badge>
          <Text style={styles.shiftDate}>
            {format(new Date(shift.date), 'EEEE, d. MMMM', { locale: de })}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Clock width={12} height={12} color="#a1a1aa" />
          <Text style={styles.timeText}>
            {shift.startTime} - {shift.endTime} Uhr
          </Text>
        </View>
      </View>
      
      {shift.hasEvent && shift.eventId && (
        <TouchableOpacity 
          style={styles.eventButton}
          onPress={() => navigateToEvent(shift.eventId)}
        >
          <Calendar width={12} height={12} color="#ffffff" />
          <Text style={styles.eventButtonText}>Event</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionSubtitle}>
        {section.data.length} {section.data.length === 1 ? "Dienst" : "Dienste"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {myAvailability.length > 0 && (
        <Card style={styles.availabilityCard}>
          <CardHeader style={styles.availabilityHeader}>
            <View style={styles.availabilityTitleContainer}>
              <AlertCircle width={16} height={16} color="#eab308" style={styles.availabilityIcon} />
              <Text style={styles.availabilityTitle}>Deine Abwesenheiten</Text>
            </View>
          </CardHeader>
          <CardContent>
            <View style={styles.availabilityList}>
              {myAvailability.map(item => (
                <View key={item.id} style={styles.availabilityItem}>
                  <Text style={styles.availabilityDate}>
                    {format(new Date(item.date), 'EEEE, d. MMMM yyyy', { locale: de })}
                  </Text>
                  <Badge style={styles.reasonBadge}>
                    {item.reason}
                  </Badge>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>
      )}

      {Object.keys(shiftsByMonth).length === 0 ? (
        <Card>
          <CardContent style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Du hast aktuell keine Dienste.</Text>
          </CardContent>
        </Card>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderShiftItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#a1a1aa',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#27272a',
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 2,
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 8,
    marginBottom: 8,
  },
  shiftDetails: {
    flex: 1,
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  shiftTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  shiftDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  eventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 4,
  },
  eventButtonText: {
    fontSize: 12,
    color: '#ffffff',
  },
  availabilityCard: {
    borderColor: 'rgba(234, 179, 8, 0.3)', // Gelb mit Transparenz
    marginBottom: 16,
  },
  availabilityHeader: {
    paddingBottom: 8,
  },
  availabilityTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityIcon: {
    marginRight: 4,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  availabilityList: {
    gap: 8,
  },
  availabilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(234, 179, 8, 0.1)', // Gelb mit Transparenz
    borderRadius: 8,
  },
  availabilityDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  reasonBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    borderColor: '#eab308',
  },
});