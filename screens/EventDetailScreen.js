import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
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
  Download,
  Music,
  Users,
  Ticket,
  ChevronLeft,
  CalendarPlus,
} from 'react-native-feather';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import { mockEvents } from '../utils/mockData';
import { Card, CardContent, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Separator } from '../components/Separator';
import { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';

// Colors for shift types
const shiftTypeColors = {
  Kasse: "#3b82f6",      // Blue
  Garderobe: "#8b5cf6",  // Purple
  Springer: "#eab308",   // Yellow
  Bar: "#22c55e",        // Green
  Theke: "#6366f1",      // Indigo
  Security: "#ef4444",   // Red
  Reinigung: "#6b7280",  // Gray
  Grill: "#f97316"       // Orange
};

export default function EventDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('djs');
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const foundEvent = mockEvents.find(e => e.id === id);
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          // Event not found, navigate back
          navigation.goBack();
          setTimeout(() => {
            Alert.alert('Event nicht gefunden');
          }, 100);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigation]);

  const handleAddToCalendar = () => {
    // Here would be the logic to add to calendar
    Alert.alert(
      'Zum Kalender hinzugefügt',
      'Das Event wurde zu deinem Kalender hinzugefügt.'
    );
  };

  const handleDownloadFlyer = () => {
    // Here would be the logic to download the flyer
    Alert.alert(
      'Flyer wird heruntergeladen',
      'Der Flyer wird heruntergeladen.'
    );
  };

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

  if (!event) {
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
              <Text style={styles.emptyText}>Event nicht gefunden.</Text>
            </CardContent>
          </Card>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const formattedDate = format(parseISO(event.date), 'EEEE, d. MMMM yyyy', { locale: de });

  // Group shifts by type
  const shiftsByType = {};
  event.shifts.forEach(shift => {
    if (!shiftsByType[shift.type]) {
      shiftsByType[shift.type] = [];
    }
    shiftsByType[shift.type].push(shift);
  });

  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft width={20} height={20} color="#ffffff" />
              <Text style={styles.backButtonText}>Zurück</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: event.imageUrl || 'https://via.placeholder.com/400x200' }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerContent}>
              <Text style={styles.eventTitle}>{event.name}</Text>
              <View style={styles.dateContainer}>
                <Calendar width={16} height={16} color="#ffffff" />
                <Text style={styles.dateText}>{formattedDate}</Text>
              </View>
            </View>
          </View>

          <Card>
            <CardHeader style={styles.cardHeader}>
              <View style={styles.badgeContainer}>
                <Badge style={styles.statusBadge}>
                  {event.status === 'upcoming' ? 'Kommendes Event' : 'Vergangenes Event'}
                </Badge>
                {event.tickets.friendPlus && (
                  <Badge variant="outline" style={styles.friendPlusBadge}>
                    Freund+ Tickets
                  </Badge>
                )}
                {event.tickets.friends && (
                  <Badge variant="outline" style={styles.friendsBadge}>
                    Freunde Tickets
                  </Badge>
                )}
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Clock width={16} height={16} color="#a1a1aa" />
                  <Text style={styles.infoText}>
                    {event.startTime} - {event.endTime} Uhr
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <MapPin width={16} height={16} color="#a1a1aa" />
                  <Text style={styles.infoText}>{event.location}</Text>
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <Text style={styles.description}>{event.description}</Text>

              <View style={styles.actionButtonsContainer}>
                {event.flyerUrl && (
                  <Button variant="outline" style={styles.actionButton} onPress={handleDownloadFlyer}>
                    <Download width={16} height={16} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Flyer herunterladen</Text>
                  </Button>
                )}
                <Button variant="outline" style={styles.actionButton} onPress={handleAddToCalendar}>
                  <CalendarPlus width={16} height={16} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Zum Kalender hinzufügen</Text>
                </Button>
              </View>
            </CardContent>
          </Card>

          <View style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === 'djs' && styles.activeTabTrigger
                ]}
                onPress={() => setActiveTab('djs')}
              >
                <Music width={16} height={16} color={activeTab === 'djs' ? '#ffffff' : '#a1a1aa'} />
                <Text style={[
                  styles.tabTriggerText,
                  activeTab === 'djs' && styles.activeTabTriggerText
                ]}>
                  DJs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === 'staff' && styles.activeTabTrigger
                ]}
                onPress={() => setActiveTab('staff')}
              >
                <Users width={16} height={16} color={activeTab === 'staff' ? '#ffffff' : '#a1a1aa'} />
                <Text style={[
                  styles.tabTriggerText,
                  activeTab === 'staff' && styles.activeTabTriggerText
                ]}>
                  Personal
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'djs' && (
              <Card style={styles.card}>
                <CardHeader>
                  <Text style={styles.cardTitle}>Line-Up</Text>
                  <Text style={styles.cardSubtitle}>
                    {event.djs.length} {event.djs.length === 1 ? 'DJ' : 'DJs'}
                  </Text>
                </CardHeader>
                <CardContent>
                  <View style={styles.djsList}>
                    {event.djs.map((dj, index) => (
                      <React.Fragment key={dj.id}>
                        {index > 0 && <Separator style={styles.separator} />}
                        <View style={styles.djItem}>
                          <View style={styles.djInfo}>
                            <Text style={styles.djName}>{dj.name}</Text>
                            <Text style={styles.djTime}>
                              {dj.startTime} - {dj.endTime} Uhr
                            </Text>
                            {dj.notes && <Text style={styles.djNotes}>{dj.notes}</Text>}
                          </View>
                          <Avatar>
                            <AvatarFallback>{dj.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </View>
                      </React.Fragment>
                    ))}
                  </View>
                </CardContent>
              </Card>
            )}

            {activeTab === 'staff' && (
              <Card style={styles.card}>
                <CardHeader>
                  <Text style={styles.cardTitle}>Personal</Text>
                  <Text style={styles.cardSubtitle}>
                    {event.shifts.length} {event.shifts.length === 1 ? 'Dienst' : 'Dienste'}
                  </Text>
                </CardHeader>
                <CardContent>
                  <View style={styles.shiftsList}>
                    {Object.entries(shiftsByType).map(([type, shifts]) => (
                      <View key={type} style={styles.shiftTypeContainer}>
                        <View style={styles.shiftTypeHeader}>
                          <Badge style={[styles.shiftTypeBadge, { backgroundColor: shiftTypeColors[type] }]}>
                            {type}
                          </Badge>
                          <Text style={styles.shiftTypeCount}>
                            {shifts.length} {shifts.length === 1 ? 'Person' : 'Personen'}
                          </Text>
                        </View>
                        <View style={styles.shiftItems}>
                          {shifts.map(shift => (
                            <View key={shift.id} style={styles.shiftItem}>
                              <View style={styles.shiftTime}>
                                <Clock width={16} height={16} color="#a1a1aa" />
                                <Text style={styles.shiftTimeText}>
                                  {shift.startTime} - {shift.endTime} Uhr
                                </Text>
                              </View>
                              {shift.staff ? (
                                <View style={styles.staffInfo}>
                                  <Text style={styles.staffName}>{shift.staff.name}</Text>
                                  <Avatar size="sm">
                                    <AvatarImage source={shift.staff.profileImage} />
                                    <AvatarFallback>{shift.staff.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                </View>
                              ) : (
                                <Badge variant="outline" style={styles.notFilledBadge}>
                                  Nicht besetzt
                                </Badge>
                              )}
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            )}
          </View>

          <Card style={styles.card}>
            <CardHeader>
              <View style={styles.cardTitleContainer}>
                <Ticket width={20} height={20} color="#ffffff" />
                <Text style={styles.cardTitle}>Tickets</Text>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.ticketsList}>
                <View style={styles.ticketItem}>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketName}>Freund+ Tickets</Text>
                    <Text style={styles.ticketDescription}>Kostenlos für deinen besten Freund</Text>
                  </View>
                  <Badge variant={event.tickets.friendPlus ? 'default' : 'secondary'} style={styles.ticketBadge}>
                    {event.tickets.friendPlus ? 'Verfügbar' : 'Nicht verfügbar'}
                  </Badge>
                </View>

                <View style={styles.ticketItem}>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketName}>Freunde Tickets</Text>
                    <Text style={styles.ticketDescription}>Vergünstigte Tickets für deine Freunde</Text>
                  </View>
                  <Badge variant={event.tickets.friends ? 'default' : 'secondary'} style={styles.ticketBadge}>
                    {event.tickets.friends ? 'Verfügbar' : 'Nicht verfügbar'}
                  </Badge>
                </View>
              </View>
            </CardContent>
            <CardFooter>
              <Text style={styles.ticketNote}>
                Bitte wende dich an die Eventleitung, um Tickets für deine Freunde zu reservieren.
              </Text>
            </CardFooter>
          </Card>
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  backButtonText: {
    color: '#ffffff',
    marginLeft: 4,
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
  bannerContainer: {
    position: 'relative',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 16,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    paddingBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#6366f1',
  },
  friendPlusBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: '#22c55e',
    color: '#22c55e',
  },
  friendsBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
    color: '#3b82f6',
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  description: {
    color: '#ffffff',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 4,
  },
  djsList: {
    gap: 16,
  },
  djItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  djInfo: {
    flex: 1,
  },
  djName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  djTime: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  djNotes: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 4,
  },
  separator: {
    marginVertical: 12,
  },
  shiftsList: {
    gap: 24,
  },
  shiftTypeContainer: {
    gap: 8,
  },
  shiftTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shiftTypeBadge: {
    color: '#ffffff',
  },
  shiftTypeCount: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  shiftItems: {
    gap: 8,
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 8,
    padding: 12,
  },
  shiftTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shiftTimeText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  staffName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginRight: 8,
  },
  notFilledBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444',
    color: '#ef4444',
  },
  ticketsList: {
    gap: 16,
  },
  ticketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 8,
    padding: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  ticketBadge: {
    marginLeft: 8,
  },
  ticketNote: {
    fontSize: 12,
    color: '#a1a1aa',
    textAlign: 'center',
  }
});