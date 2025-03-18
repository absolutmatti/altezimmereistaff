import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CalendarPlus, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from 'react-native-feather';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import { mockMeetings } from '../utils/mockData';
import { Card, CardContent, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';

export default function MeetingsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMeetings(mockMeetings);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  // Handle adding a meeting to calendar
  const handleAddToCalendar = (meeting) => {
    console.log('Adding to calendar:', meeting.title);
    Alert.alert(
      'Zum Kalender hinzugefügt',
      `Die Besprechung "${meeting.title}" wurde zu deinem Kalender hinzugefügt.`
    );
  };

  // Handle attending/declining a meeting
  const handleStatusChange = (status) => {
    const actionText = status === 'attending' ? 'Teilnahme bestätigt' : 'Absage gesendet';
    const description = status === 'attending' 
      ? 'Du nimmst an der Besprechung teil.' 
      : 'Du hast für die Besprechung abgesagt.';
    
    Alert.alert(actionText, description);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#18181b', '#09090b']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.title}>Besprechungen</Text>
            <Card>
              <CardContent style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
              </CardContent>
            </Card>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Filter meetings by status
  const upcomingMeetings = meetings.filter(meeting => meeting.status === 'upcoming');
  const pastMeetings = meetings.filter(meeting => meeting.status === 'past');

  // Get the next meeting
  const nextMeeting = upcomingMeetings.length > 0
    ? upcomingMeetings.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      })[0]
    : null;

  // Get current user (mock)
  const currentUserId = 'staff1';

  // Render meeting attendee status component
  const renderAttendeeStatus = (attendee) => {
    const statusStyle = {
      attending: { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' },
      declined: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' },
      pending: { backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#eab308' }
    };

    const statusText = {
      attending: 'Zugesagt',
      declined: 'Abgesagt',
      pending: 'Ausstehend'
    };

    return (
      <View key={attendee.user.id} style={styles.attendeeContainer}>
        <Avatar size="xs" source={attendee.user.profileImage} fallback={attendee.user.name.charAt(0)} />
        <View style={styles.attendeeInfo}>
          <Text style={styles.attendeeName}>{attendee.user.name}</Text>
          <Badge 
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle[attendee.status].backgroundColor }
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle[attendee.status].color }]}>
              {statusText[attendee.status]}
            </Text>
          </Badge>
        </View>
      </View>
    );
  };

  // Render attendance buttons for current user
  const renderAttendanceButtons = (meeting) => {
    const attendee = meeting.attendees.find(a => a.user.id === currentUserId);

    if (!attendee) {
      return <Text style={styles.notInvitedText}>Du bist nicht zu dieser Besprechung eingeladen.</Text>;
    }

    return (
      <View style={styles.attendanceButtons}>
        <Button
          variant={attendee.status === 'attending' ? 'default' : 'outline'}
          style={[
            styles.attendButton,
            attendee.status === 'attending' && styles.activeAttendButton
          ]}
          onPress={() => handleStatusChange('attending')}
          icon={<CheckCircle width={16} height={16} color={attendee.status === 'attending' ? '#FFFFFF' : '#6366f1'} />}
        >
          Teilnehmen
        </Button>
        <Button
          variant={attendee.status === 'declined' ? 'destructive' : 'outline'}
          style={[
            styles.declineButton,
            attendee.status === 'declined' && styles.activeDeclineButton
          ]}
          onPress={() => handleStatusChange('declined')}
          icon={<XCircle width={16} height={16} color={attendee.status === 'declined' ? '#FFFFFF' : '#ef4444'} />}
        >
          Absagen
        </Button>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Besprechungen</Text>
            
            {nextMeeting ? (
              <Card style={styles.nextMeetingCard}>
                <CardHeader style={styles.nextMeetingHeader}>
                  <View style={styles.nextMeetingTitleContainer}>
                    <Calendar width={20} height={20} color="#6366f1" />
                    <Text style={styles.nextMeetingTitle}>Nächste Besprechung</Text>
                  </View>
                  <Text style={styles.nextMeetingDate}>
                    {format(parseISO(nextMeeting.date), 'EEEE, d. MMMM yyyy', { locale: de })}
                  </Text>
                </CardHeader>
                <CardContent style={styles.nextMeetingContent}>
                  <View style={styles.meetingInfo}>
                    <Text style={styles.meetingTitle}>{nextMeeting.title}</Text>
                    <View style={styles.meetingDetails}>
                      <View style={styles.detailRow}>
                        <Clock width={16} height={16} color="#a1a1aa" />
                        <Text style={styles.detailText}>
                          {nextMeeting.startTime} - {nextMeeting.endTime} Uhr
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <MapPin width={16} height={16} color="#a1a1aa" />
                        <Text style={styles.detailText}>{nextMeeting.location}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.meetingDescription}>{nextMeeting.description}</Text>

                  <View>
                    <Text style={styles.attendeesTitle}>
                      Teilnehmer ({nextMeeting.attendees.length})
                    </Text>
                    <View style={styles.attendeesList}>
                      {nextMeeting.attendees.map(attendee => renderAttendeeStatus(attendee))}
                    </View>
                  </View>

                  <View style={styles.userStatusSection}>
                    <Text style={styles.userStatusTitle}>Dein Status</Text>
                    {renderAttendanceButtons(nextMeeting)}
                  </View>

                  <Button
                    variant="outline"
                    style={styles.calendarButton}
                    onPress={() => handleAddToCalendar(nextMeeting)}
                    icon={<CalendarPlus width={16} height={16} color="#ffffff" />}
                  >
                    Zum Kalender hinzufügen
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Noch keine Besprechung geplant.</Text>
                </CardContent>
              </Card>
            )}

            <View style={styles.tabsContainer}>
              <View style={styles.tabsList}>
                <TouchableOpacity
                  style={[
                    styles.tabTrigger,
                    activeTab === 'upcoming' && styles.activeTabTrigger
                  ]}
                  onPress={() => setActiveTab('upcoming')}
                >
                  <Text style={[
                    styles.tabTriggerText,
                    activeTab === 'upcoming' && styles.activeTabTriggerText
                  ]}>
                    Kommende Besprechungen
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabTrigger,
                    activeTab === 'past' && styles.activeTabTrigger
                  ]}
                  onPress={() => setActiveTab('past')}
                >
                  <Text style={[
                    styles.tabTriggerText,
                    activeTab === 'past' && styles.activeTabTriggerText
                  ]}>
                    Vergangene Besprechungen
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tabContent}>
                {activeTab === 'upcoming' && (
                  <View style={styles.tabContentInner}>
                    {upcomingMeetings.length === 0 ? (
                      <Card>
                        <CardContent style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>Keine kommenden Besprechungen gefunden.</Text>
                        </CardContent>
                      </Card>
                    ) : (
                      upcomingMeetings.map(meeting => (
                        <MeetingCard 
                          key={meeting.id} 
                          meeting={meeting} 
                          onPress={() => navigation.navigate('MeetingDetail', { meetingId: meeting.id })}
                        />
                      ))
                    )}
                  </View>
                )}

                {activeTab === 'past' && (
                  <View style={styles.tabContentInner}>
                    {pastMeetings.length === 0 ? (
                      <Card>
                        <CardContent style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>Keine vergangenen Besprechungen gefunden.</Text>
                        </CardContent>
                      </Card>
                    ) : (
                      pastMeetings.map(meeting => (
                        <MeetingCard 
                          key={meeting.id} 
                          meeting={meeting} 
                          onPress={() => navigation.navigate('MeetingDetail', { meetingId: meeting.id })}
                        />
                      ))
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function MeetingCard({ meeting, onPress }) {
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
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  nextMeetingCard: {
    borderColor: 'rgba(99, 102, 241, 0.5)',
    marginBottom: 24,
  },
  nextMeetingHeader: {
    paddingBottom: 8,
  },
  nextMeetingTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextMeetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  nextMeetingDate: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 4,
  },
  nextMeetingContent: {
    gap: 16,
  },
  meetingInfo: {
    gap: 8,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  meetingDetails: {
    gap: 4,
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
  meetingDescription: {
    fontSize: 14,
    color: '#d4d4d8',
  },
  attendeesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  attendeesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attendeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendeeInfo: {
    flexDirection: 'column',
  },
  attendeeName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  statusBadge: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusText: {
    fontSize: 10,
  },
  userStatusSection: {
    gap: 8,
  },
  userStatusTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  attendanceButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  attendButton: {
    flex: 1,
  },
  activeAttendButton: {
    backgroundColor: '#22c55e',
  },
  declineButton: {
    flex: 1,
  },
  activeDeclineButton: {
    backgroundColor: '#ef4444',
  },
  notInvitedText: {
    fontSize: 14,
    color: '#a1a1aa',
    fontStyle: 'italic',
  },
  calendarButton: {
    alignSelf: 'flex-start',
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
  tabsContainer: {
    flex: 1,
  },
  tabsList: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 4,
  },
  tabTrigger: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  activeTabTrigger: {
    backgroundColor: '#6366f1',
  },
  tabTriggerText: {
    color: '#a1a1aa',
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabTriggerText: {
    color: '#ffffff',
  },
  tabContent: {
    flex: 1,
  },
  tabContentInner: {
    gap: 16,
  },
  // Meeting Card styles
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