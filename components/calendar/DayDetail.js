import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Linking
} from 'react-native';
import { format, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CalendarDays,
  X
} from 'react-native-feather';

import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';

export default function DayDetail({ date, calendarDays, onAddAvailability, onClose }) {
  const formattedDate = format(date, 'EEEE, d. MMMM yyyy', { locale: de });

  // Suche nach Tagesdaten für das ausgewählte Datum
  const dayData = calendarDays.find(day => isSameDay(day.date, date));

  // Prüfe, ob es Einträge für diesen Tag gibt
  const hasEntries = dayData && (
    dayData.hasEvent || 
    dayData.hasMeeting || 
    dayData.hasShift || 
    dayData.hasAvailability || 
    dayData.hasStaffAvailability
  );

  const navigateToEvent = (eventId) => {
    // Hier würden Sie zur Event-Detail-Seite navigieren
    console.log(`Navigiere zu Event: ${eventId}`);
    // Beispiel für die Navigation
    // navigation.navigate('EventDetail', { eventId });
  };

  const navigateToMeeting = (meetingId) => {
    // Hier würden Sie zur Meeting-Detail-Seite navigieren
    console.log(`Navigiere zu Meeting: ${meetingId}`);
    // Beispiel für die Navigation
    // navigation.navigate('MeetingDetail', { meetingId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Calendar width={20} height={20} color="#ffffff" style={styles.titleIcon} />
          <Text style={styles.title}>{formattedDate}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X width={20} height={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>Details für diesen Tag</Text>
      
      <ScrollView style={styles.contentScroll}>
        {!hasEntries ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Keine Einträge für diesen Tag.</Text>
          </View>
        ) : (
          <View style={styles.entriesContainer}>
            {dayData?.hasEvent && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Badge variant="primary" style={styles.eventBadge}>Event</Badge>
                </View>
                <Card style={styles.detailCard}>
                  <TouchableOpacity 
                    style={styles.cardContent}
                    onPress={() => navigateToEvent(dayData.event?.id)}
                  >
                    <Text style={styles.cardTitle}>{dayData.event?.name}</Text>
                    <View style={styles.detailRow}>
                      <Clock width={12} height={12} color="#a1a1aa" style={styles.detailIcon} />
                      <Text style={styles.detailText}>
                        {dayData.event?.startTime} - {dayData.event?.endTime} Uhr
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin width={12} height={12} color="#a1a1aa" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{dayData.event?.location}</Text>
                    </View>
                  </TouchableOpacity>
                </Card>
                <View style={styles.separator} />
              </View>
            )}

            {dayData?.hasMeeting && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Badge variant="primary" style={styles.meetingBadge}>Besprechung</Badge>
                </View>
                <Card style={styles.detailCard}>
                  <TouchableOpacity 
                    style={styles.cardContent}
                    onPress={() => navigateToMeeting(dayData.meeting?.id)}
                  >
                    <Text style={styles.cardTitle}>{dayData.meeting?.title}</Text>
                    <View style={styles.detailRow}>
                      <Clock width={12} height={12} color="#a1a1aa" style={styles.detailIcon} />
                      <Text style={styles.detailText}>
                        {dayData.meeting?.startTime} - {dayData.meeting?.endTime} Uhr
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin width={12} height={12} color="#a1a1aa" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{dayData.meeting?.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Users width={12} height={12} color="#a1a1aa" style={styles.detailIcon} />
                      <Text style={styles.detailText}>
                        {dayData.meeting?.attendees.filter(a => a.status === "attending").length} Teilnehmer
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Card>
                <View style={styles.separator} />
              </View>
            )}

            {dayData?.hasShift && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Badge variant="primary" style={styles.shiftBadge}>Dienst</Badge>
                </View>
                {dayData.shifts?.map((shift, index) => (
                  <Card key={index} style={styles.detailCard}>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{shift.type}</Text>
                      <View style={styles.detailRow}>
                        <Clock width={12} height={12} color="#a1a1aa" style={styles.detailIcon} />
                        <Text style={styles.detailText}>
                          {shift.startTime} - {shift.endTime} Uhr
                        </Text>
                      </View>
                      {shift.eventId && (
                        <TouchableOpacity 
                          onPress={() => navigateToEvent(shift.eventId)}
                          style={styles.linkButton}
                        >
                          <Text style={styles.linkText}>Zum Event</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </Card>
                ))}
                <View style={styles.separator} />
              </View>
            )}

            {dayData?.hasAvailability && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Badge variant="destructive" style={styles.availabilityBadge}>Abwesenheit</Badge>
                </View>
                <Card style={styles.detailCard}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Du bist an diesem Tag abwesend</Text>
                    {dayData.availability?.reason && (
                      <Text style={styles.detailText}>{dayData.availability.reason}</Text>
                    )}
                  </View>
                </Card>
                <View style={styles.separator} />
              </View>
            )}

            {dayData?.hasStaffAvailability && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Badge variant="outline" style={styles.staffAvailabilityBadge}>Mitarbeiter-Abwesenheit</Badge>
                </View>
                <Card style={styles.detailCard}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Mitarbeiter abwesend</Text>
                    {dayData.staffAvailability?.reason && (
                      <Text style={styles.detailText}>{dayData.staffAvailability.reason}</Text>
                    )}
                  </View>
                </Card>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="outline"
          style={styles.footerButton}
          icon={<CalendarDays width={16} height={16} color="#ffffff" />}
          onPress={() => onAddAvailability(date)}
        >
          Abwesenheit für {format(date, 'd. MMMM', { locale: de })} angeben
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 8,
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
  subtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 16,
  },
  contentScroll: {
    maxHeight: '70%',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#a1a1aa',
  },
  entriesContainer: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  detailCard: {
    marginBottom: 8,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  separator: {
    height: 1,
    backgroundColor: '#27272a',
    marginVertical: 8,
  },
  footer: {
    marginTop: 16,
  },
  footerButton: {
    width: '100%',
  },
  linkButton: {
    marginTop: 8,
  },
  linkText: {
    color: '#6366f1',
    fontSize: 14,
  },
  eventBadge: {
    backgroundColor: '#3b82f6', // Blau für Events
  },
  meetingBadge: {
    backgroundColor: '#8b5cf6', // Lila für Besprechungen
  },
  shiftBadge: {
    backgroundColor: '#22c55e', // Grün für Dienste
  },
  availabilityBadge: {
    backgroundColor: '#ef4444', // Rot für Abwesenheiten
  },
  staffAvailabilityBadge: {
    borderColor: '#eab308', // Gelb für Mitarbeiter-Abwesenheiten
    color: '#eab308',
  },
});