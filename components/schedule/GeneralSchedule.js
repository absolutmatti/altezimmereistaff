import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList
} from 'react-native';
import { format, addMonths, subMonths } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Loader2
} from 'react-native-feather';
import { Picker } from '@react-native-picker/picker';

import { Card, CardContent, CardHeader } from '../Card';
import { Badge } from '../Badge';
import { mockSchedule } from '../../utils/mockData';

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

export default function GeneralSchedule() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSchedule(mockSchedule);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
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

  if (!schedule) {
    return (
      <Card>
        <CardContent style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Dienstplan konnte nicht geladen werden.</Text>
        </CardContent>
      </Card>
    );
  }

  // Filter days with shifts
  const daysWithShifts = schedule.days.filter(day => day.shifts.length > 0);

  // Filter shifts by type if needed
  const filteredDays = daysWithShifts
    .map(day => {
      if (filterType === 'all') {
        return day;
      }

      return {
        ...day,
        shifts: day.shifts.filter(shift => shift.type === filterType),
      };
    })
    .filter(day => day.shifts.length > 0);

  const renderDayItem = ({ item: day }) => (
    <Card key={day.date} style={day.hasEvent ? styles.eventCard : null}>
      <CardHeader style={styles.dayHeader}>
        <View style={styles.dayHeaderTitleContainer}>
          <Text style={styles.dayHeaderTitle}>
            {format(new Date(day.date), 'EEEE, d. MMMM', { locale: de })}
          </Text>
        </View>
        {day.hasEvent && day.eventId && (
          <TouchableOpacity 
            onPress={() => console.log(`Navigate to event: ${day.eventId}`)}
            style={styles.eventBadgeContainer}
          >
            <Badge style={styles.eventBadge}>
              <Calendar width={12} height={12} color="#ffffff" />
              <Text style={styles.eventBadgeText}>Event</Text>
            </Badge>
          </TouchableOpacity>
        )}
      </CardHeader>
      <CardContent>
        <View style={styles.shiftsContainer}>
          {day.shifts.map(shift => (
            <View key={shift.id} style={styles.shiftItem}>
              <View style={styles.shiftItemLeft}>
                <Badge 
                  style={[
                    styles.shiftTypeBadge, 
                    { backgroundColor: shiftTypeColors[shift.type] || '#6b7280' }
                  ]}
                >
                  {shift.type}
                </Badge>
                <Text style={styles.timeText}>
                  {shift.startTime} - {shift.endTime} Uhr
                </Text>
              </View>
              <View>
                {shift.staff ? (
                  <Text style={styles.staffName}>{shift.staff.name}</Text>
                ) : (
                  <Badge style={styles.notFilledBadge}>
                    <Text style={styles.notFilledText}>Nicht besetzt</Text>
                  </Badge>
                )}
              </View>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.monthCard}>
        <CardHeader style={styles.monthHeader}>
          <Text style={styles.monthTitle}>Monatsübersicht</Text>
          <View style={styles.monthNavigation}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handlePreviousMonth}
            >
              <ChevronLeft width={16} height={16} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.monthName}>
              {format(currentDate, 'MMMM yyyy', { locale: de })}
            </Text>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleNextMonth}
            >
              <ChevronRight width={16} height={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.monthDescription}>
            Übersicht aller Dienste für {format(currentDate, 'MMMM yyyy', { locale: de })}
          </Text>
        </CardHeader>
        <CardContent>
          <View style={styles.filterContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filterType}
                onValueChange={(itemValue) => setFilterType(itemValue)}
                style={styles.picker}
                dropdownIconColor="#ffffff"
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Alle Diensttypen" value="all" />
                <Picker.Item label="Kasse" value="Kasse" />
                <Picker.Item label="Garderobe" value="Garderobe" />
                <Picker.Item label="Bar" value="Bar" />
                <Picker.Item label="Springer" value="Springer" />
                <Picker.Item label="Theke" value="Theke" />
                <Picker.Item label="Security" value="Security" />
                <Picker.Item label="Reinigung" value="Reinigung" />
                <Picker.Item label="Grill" value="Grill" />
              </Picker>
            </View>
          </View>

          {filteredDays.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Keine Dienste für diesen Monat gefunden.</Text>
            </View>
          ) : (
            <FlatList
              data={filteredDays}
              renderItem={renderDayItem}
              keyExtractor={item => item.date}
              contentContainerStyle={styles.daysList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthCard: {
    marginBottom: 16,
  },
  monthHeader: {
    paddingBottom: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  navButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(39, 39, 42, 0.8)',
  },
  monthName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginHorizontal: 16,
  },
  monthDescription: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  filterContainer: {
    marginBottom: 16,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#27272a',
  },
  picker: {
    color: '#ffffff',
    backgroundColor: '#27272a',
  },
  pickerItem: {
    color: '#ffffff',
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
  daysList: {
    paddingBottom: 16,
  },
  eventCard: {
    borderColor: '#6366f1',
    borderWidth: 1,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  dayHeaderTitleContainer: {
    flex: 1,
  },
  dayHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  eventBadgeContainer: {
    marginLeft: 8,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#6366f1',
    gap: 4,
  },
  eventBadgeText: {
    color: '#ffffff',
    fontSize: 12,
  },
  shiftsContainer: {
    gap: 8,
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 8,
  },
  shiftItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shiftTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timeText: {
    fontSize: 13,
    color: '#d4d4d8',
  },
  staffName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  notFilledBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444',
  },
  notFilledText: {
    fontSize: 12,
    color: '#ef4444',
  },
});