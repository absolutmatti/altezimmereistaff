import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  CalendarPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  FileText,
  Edit,
  Info,
  CheckSquare,
  ListTodo
} from 'react-native-feather';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import { mockMeetings } from '../utils/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Separator } from '../components/Separator';
import { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';

export default function MeetingDetailScreen({ route, navigation }) {
  const { meetingId } = route.params;
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('attendees');

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundMeeting = mockMeetings.find(m => m.id === meetingId);
        if (foundMeeting) {
          setMeeting(foundMeeting);
        } else {
          navigation.goBack();
          setTimeout(() => {
            Alert.alert('Besprechung nicht gefunden.');
          }, 100);
        }
      } catch (error) {
        console.error('Error fetching meeting:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId, navigation]);

  const handleAddToCalendar = () => {
    Alert.alert('Zum Kalender hinzugefügt', 'Die Besprechung wurde zu deinem Kalender hinzugefügt.');
  };

  const handleAttend = () => {
    Alert.alert('Teilnahme bestätigt', 'Deine Teilnahme wurde bestätigt.');
  };

  const handleDecline = () => {
    setShowDeclineDialog(true);
  };

  const submitDecline = () => {
    Alert.alert('Absage gesendet', 'Deine Absage wurde gesendet.');
    setShowDeclineDialog(false);
    setDeclineReason('');
  };

  // Mock current user ID
  const currentUserId = 'staff1';
  const isOwner = currentUserId === 'owner1' || currentUserId === 'owner2';

  if (loading) {
    return (
      <LinearGradient
        colors={['#18181b', '#09090b']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft width={20} height={20} color="#ffffff" />
              <Text style={styles.backButtonText}>Zurück</Text>
            </TouchableOpacity>
          </View>
          <Card>
            <CardContent style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
            </CardContent>
          </Card>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!meeting) {
    return (
      <LinearGradient
        colors={['#18181b', '#09090b']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft width={20} height={20} color="#ffffff" />
              <Text style={styles.backButtonText}>Zurück</Text>
            </TouchableOpacity>
          </View>
          <Card>
            <CardContent style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Besprechung nicht gefunden.</Text>
            </CardContent>
          </Card>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const formattedDate = format(parseISO(meeting.date), 'EEEE, d. MMMM yyyy', { locale: de });

  // Get current user's attendance status
  const currentAttendee = meeting.attendees.find(a => a.user.id === currentUserId);
  const attendanceStatus = currentAttendee?.status || 'pending';

  // Count attendees by status
  const attending = meeting.attendees.filter(a => a.status === 'attending').length;
  const declined = meeting.attendees.filter(a => a.status === 'declined').length;
  const pending = meeting.attendees.filter(a => a.status === 'pending').length;

  const renderProtocolItem = (item) => {
    const typeIcons = {
      info: <Info width={20} height={20} color="#3b82f6" />,
      decision: <CheckSquare width={20} height={20} color="#22c55e" />,
      task: <ListTodo width={20} height={20} color="#eab308" />
    };

    const typeLabels = {
      info: 'Information',
      decision: 'Entscheidung',
      task: 'Aufgabe'
    };

    const badgeStyles = {
      info: { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' },
      decision: { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' },
      task: { backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#eab308' }
    };

    return (
      <View key={item.id} style={styles.protocolItem}>
        <View style={styles.protocolItemHeader}>
          {typeIcons[item.type]}
          <Badge 
            style={[
              styles.typeBadge,
              { backgroundColor: badgeStyles[item.type].backgroundColor }
            ]}
          >
            <Text style={[styles.typeBadgeText, { color: badgeStyles[item.type].color }]}>
              {typeLabels[item.type]}
            </Text>
          </Badge>
        </View>

        <Text style={styles.protocolItemTitle}>{item.title}</Text>
        <Text style={styles.protocolItemContent}>{item.content}</Text>

        {item.type === 'task' && item.assignedTo && (
          <View style={styles.taskAssignment}>
            <Text style={styles.assignedToLabel}>Zugewiesen an:</Text>
            <View style={styles.assignedToUser}>
              <Avatar size="xs" source={item.assignedTo.profileImage} fallback={item.assignedTo.name.charAt(0)} />
              <Text style={styles.assignedToName}>{item.assignedTo.name}</Text>
            </View>
            {item.dueDate && (
              <View style={styles.dueDate}>
                <Calendar width={12} height={12} color="#a1a1aa" />
                <Text style={styles.dueDateText}>
                  {format(parseISO(item.dueDate), 'd. MMMM yyyy', { locale: de })}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft width={20} height={20} color="#ffffff" />
            <Text style={styles.backButtonText}>Zurück</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <Card style={styles.mainCard}>
            <CardHeader style={styles.mainCardHeader}>
              <View style={styles.badgeContainer}>
                <Badge 
                  style={
                    meeting.status === 'upcoming' 
                      ? styles.upcomingBadge 
                      : styles.pastBadge
                  }
                >
                  {meeting.status === 'upcoming' ? 'Kommende Besprechung' : 'Vergangene Besprechung'}
                </Badge>
              </View>
              <Text style={styles.meetingTitle}>{meeting.title}</Text>
              <View style={styles.meetingDetails}>
                <View style={styles.detailRow}>
                  <Calendar width={16} height={16} color="#a1a1aa" />
                  <Text style={styles.detailText}>{formattedDate}</Text>
                </View>
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
            </CardHeader>
            <CardContent>
              <Text style={styles.description}>{meeting.description}</Text>

              {meeting.status === 'upcoming' && (
                <View style={styles.statusSection}>
                  <Text style={styles.statusTitle}>Dein Status</Text>
                  <View style={styles.attendanceButtons}>
                    <Button
                      variant={attendanceStatus === 'attending' ? 'default' : 'outline'}
                      style={[
                        styles.attendButton,
                        attendanceStatus === 'attending' && styles.activeAttendButton
                      ]}
                      onPress={handleAttend}
                      icon={<CheckCircle width={16} height={16} color={attendanceStatus === 'attending' ? '#FFFFFF' : '#6366f1'} />}
                    >
                      Teilnehmen
                    </Button>
                    <Button
                      variant={attendanceStatus === 'declined' ? 'destructive' : 'outline'}
                      style={styles.declineButton}
                      onPress={handleDecline}
                      icon={<XCircle width={16} height={16} color={attendanceStatus === 'declined' ? '#FFFFFF' : '#ef4444'} />}
                    >
                      Absagen
                    </Button>
                  </View>
                </View>
              )}

              {meeting.status === 'upcoming' && (
                <Button
                  variant="outline"
                  style={styles.calendarButton}
                  onPress={handleAddToCalendar}
                  icon={<CalendarPlus width={16} height={16} color="#ffffff" />}
                >
                  Zum Kalender hinzufügen
                </Button>
              )}
            </CardContent>
          </Card>

          <View style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === 'attendees' && styles.activeTabTrigger
                ]}
                onPress={() => setActiveTab('attendees')}
              >
                <Users width={16} height={16} color={activeTab === 'attendees' ? '#ffffff' : '#a1a1aa'} />
                <Text style={[
                  styles.tabTriggerText,
                  activeTab === 'attendees' && styles.activeTabTriggerText
                ]}>
                  Teilnehmer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === 'protocol' && styles.activeTabTrigger
                ]}
                onPress={() => setActiveTab('protocol')}
              >
                <FileText width={16} height={16} color={activeTab === 'protocol' ? '#ffffff' : '#a1a1aa'} />
                <Text style={[
                  styles.tabTriggerText,
                  activeTab === 'protocol' && styles.activeTabTriggerText
                ]}>
                  Protokoll
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'attendees' && (
              <Card style={styles.tabCard}>
                <CardHeader style={styles.attendeesHeader}>
                  <Text style={styles.attendeesTitle}>Teilnehmer</Text>
                  <Text style={styles.attendeesSubtitle}>{meeting.attendees.length} Personen eingeladen</Text>
                </CardHeader>
                <CardContent>
                  <View style={styles.attendeesStats}>
                    <View style={styles.statItem}>
                      <CheckCircle width={16} height={16} color="#22c55e" />
                      <Text style={styles.statText}>{attending} zugesagt</Text>
                    </View>
                    <View style={styles.statItem}>
                      <XCircle width={16} height={16} color="#ef4444" />
                      <Text style={styles.statText}>{declined} abgesagt</Text>
                    </View>
                    <View style={styles.statItem}>
                      <AlertCircle width={16} height={16} color="#eab308" />
                      <Text style={styles.statText}>{pending} ausstehend</Text>
                    </View>
                  </View>

                  <View style={styles.attendeesList}>
                    {meeting.attendees.map((attendee, index) => (
                      <View key={attendee.user.id}>
                        {index > 0 && <Separator style={styles.attendeeSeparator} />}
                        <View style={styles.attendeeItem}>
                          <View style={styles.attendeeInfo}>
                            <Avatar size="sm" source={attendee.user.profileImage} fallback={attendee.user.name.charAt(0)} />
                            <View style={styles.attendeeDetails}>
                              <Text style={styles.attendeeName}>{attendee.user.name}</Text>
                              <Badge
                                style={[
                                  styles.statusBadge,
                                  attendee.status === 'attending' && styles.attendingBadge,
                                  attendee.status === 'declined' && styles.declinedBadge,
                                  attendee.status === 'pending' && styles.pendingBadge
                                ]}
                              >
                                {attendee.status === 'attending'
                                  ? 'Zugesagt'
                                  : attendee.status === 'declined'
                                    ? 'Abgesagt'
                                    : 'Ausstehend'}
                              </Badge>
                            </View>
                          </View>

                          {attendee.status === 'declined' && attendee.declineReason && (
                            <View style={styles.declineReasonContainer}>
                              <Text style={styles.declineReason}>{attendee.declineReason}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            )}

            {activeTab === 'protocol' && (
              <Card style={styles.tabCard}>
                <CardHeader style={styles.protocolHeader}>
                  <View style={styles.protocolHeaderTitle}>
                    <Text style={styles.protocolTitle}>Protokoll</Text>
                    {isOwner && meeting.status === 'past' && (
                      <TouchableOpacity
                        style={styles.editProtocolButton}
                        onPress={() => navigation.navigate('EditProtocol', { meetingId: meeting.id })}
                      >
                        <Edit width={16} height={16} color="#ffffff" />
                        <Text style={styles.editProtocolText}>
                          {meeting.isProtocolFinalized ? 'Bearbeiten' : 'Erstellen'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.protocolSubtitle}>
                    {meeting.status === 'upcoming'
                      ? 'Das Protokoll wird nach der Besprechung verfügbar sein.'
                      : meeting.isProtocolFinalized
                        ? 'Finalisiertes Protokoll'
                        : 'Protokoll noch nicht finalisiert'}
                  </Text>
                </CardHeader>
                <CardContent>
                  {meeting.status === 'upcoming' ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>Das Protokoll wird nach der Besprechung verfügbar sein.</Text>
                    </View>
                  ) : !meeting.protocol || meeting.protocol.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>Noch kein Protokoll verfügbar.</Text>
                    </View>
                  ) : (
                    <View style={styles.protocolList}>
                      {meeting.protocol.map(item => renderProtocolItem(item))}
                    </View>
                  )}
                </CardContent>
              </Card>
            )}
          </View>
        </ScrollView>

        {/* Modal for declining a meeting */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDeclineDialog}
          onRequestClose={() => setShowDeclineDialog(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Besprechung absagen</Text>
                <Text style={styles.modalSubtitle}>Bitte gib einen Grund für deine Absage an.</Text>
              </View>

              <TextInput
                style={styles.declineInput}
                placeholder="Grund für die Absage"
                placeholderTextColor="#71717a"
                value={declineReason}
                onChangeText={setDeclineReason}
                multiline={true}
              />

              <View style={styles.modalFooter}>
                <Button
                  variant="outline"
                  style={styles.modalCancelButton}
                  onPress={() => setShowDeclineDialog(false)}
                >
                  Abbrechen
                </Button>
                <Button
                  variant="destructive"
                  style={styles.modalDeclineButton}
                  onPress={submitDecline}
                >
                  Absagen
                </Button>
              </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
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
  mainCard: {
    marginBottom: 24,
  },
  mainCardHeader: {
    paddingBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  upcomingBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#6366f1',
  },
  pastBadge: {
    backgroundColor: 'rgba(161, 161, 170, 0.2)',
    color: '#a1a1aa',
  },
  meetingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  meetingDetails: {
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
  description: {
    fontSize: 16,
    color: '#d4d4d8',
    marginBottom: 24,
    lineHeight: 24,
  },
  statusSection: {
    marginBottom: 16,
    gap: 8,
  },
  statusTitle: {
    fontSize: 16,
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
  calendarButton: {
    alignSelf: 'flex-start',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 8,
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
  tabCard: {
    marginBottom: 16,
  },
  attendeesHeader: {
    paddingBottom: 8,
  },
  attendeesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  attendeesSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  attendeesStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
  attendeesList: {
    gap: 8,
  },
  attendeeSeparator: {
    marginVertical: 8,
  },
  attendeeItem: {
    gap: 8,
  },
  attendeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  attendeeDetails: {
    gap: 4,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  statusBadge: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  attendingBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
  },
  declinedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
  },
  pendingBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    color: '#eab308',
  },
  declineReasonContainer: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    padding: 8,
    borderRadius: 8,
  },
  declineReason: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  protocolHeader: {
    paddingBottom: 8,
  },
  protocolHeaderTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  protocolTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  editProtocolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  editProtocolText: {
    fontSize: 14,
    color: '#ffffff',
  },
  protocolSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 4,
  },
  protocolList: {
    gap: 16,
  },
  protocolItem: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  protocolItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  typeBadge: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeBadgeText: {
    fontSize: 12,
  },
  protocolItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  protocolItemContent: {
    fontSize: 14,
    color: '#d4d4d8',
  },
  taskAssignment: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  assignedToLabel: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  assignedToUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assignedToName: {
    fontSize: 12,
    color: '#ffffff',
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#a1a1aa',
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
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  declineInput: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    height: 100,
    color: '#ffffff',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalDeclineButton: {
    flex: 1,
  },
});