import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'react-native-feather';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import { Card, CardContent, CardHeader, CardFooter } from '../Card';
import { Button } from '../Button';

export default function MeetingCard({ meeting, onPress }) {
  const formattedDate = format(parseISO(meeting.date), 'EEEE, d. MMMM yyyy', { locale: de });

  // Count attendees by status
  const attending = meeting.attendees.filter(a => a.status === 'attending').length;
  const declined = meeting.attendees.filter(a => a.status === 'declined').length;
  const pending = meeting.attendees.filter(a => a.status === 'pending').length;

  return (
    <Card style={styles.card}>
      <CardHeader style={styles.header}>
        <Text style={styles.title}>{meeting.title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </CardHeader>
      <CardContent style={styles.content}>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Clock width={16} height={16} color="#a1a1aa" />
            <Text style={styles.detailText}>
              {meeting.startTime} - {meeting.endTime} Uhr
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin width={16} height={16} color="#a1a1aa" />
            <Text style={styles.detailText}>{meeting.location}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <CheckCircle width={16} height={16} color="#22c55e" />
            <Text style={styles.statText}>{attending}</Text>
          </View>
          <View style={styles.statItem}>
            <XCircle width={16} height={16} color="#ef4444" />
            <Text style={styles.statText}>{declined}</Text>
          </View>
          <View style={styles.statItem}>
            <AlertCircle width={16} height={16} color="#eab308" />
            <Text style={styles.statText}>{pending}</Text>
          </View>
        </View>
      </CardContent>
      <CardFooter style={styles.footer}>
        <Button onPress={onPress}>Details</Button>
      </CardFooter>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  date: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 4,
  },
  content: {
    gap: 16,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  footer: {
    justifyContent: 'flex-end',
  },
});