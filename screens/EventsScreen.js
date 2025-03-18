import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  Clock, 
  MapPin 
} from 'react-native-feather';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import { mockEvents } from '../utils/mockData';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

export default function EventsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={['#18181b', '#09090b']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.title}>Events</Text>
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

  // Filter events by status
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const pastEvents = events.filter(event => event.status === 'past');

  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Events</Text>

            <View style={styles.tabsContainer}>
              <View style={styles.tabsList}>
                <TouchableOpacity
                  style={[
                    styles.tabTrigger,
                    activeTab === 'upcoming' && styles.tabTriggerActive,
                  ]}
                  onPress={() => setActiveTab('upcoming')}
                >
                  <Text style={[
                    styles.tabTriggerText,
                    activeTab === 'upcoming' && styles.tabTriggerTextActive,
                  ]}>
                    Kommende Events
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabTrigger,
                    activeTab === 'past' && styles.tabTriggerActive,
                  ]}
                  onPress={() => setActiveTab('past')}
                >
                  <Text style={[
                    styles.tabTriggerText,
                    activeTab === 'past' && styles.tabTriggerTextActive,
                  ]}>
                    Vergangene Events
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tabContent}>
                {activeTab === 'upcoming' && (
                  <View>
                    {upcomingEvents.length === 0 ? (
                      <Card>
                        <CardContent style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>Keine kommenden Events gefunden.</Text>
                        </CardContent>
                      </Card>
                    ) : (
                      upcomingEvents.map(event => <EventCard key={event.id} event={event} navigation={navigation} />)
                    )}
                  </View>
                )}

                {activeTab === 'past' && (
                  <View>
                    {pastEvents.length === 0 ? (
                      <Card>
                        <CardContent style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>Keine vergangenen Events gefunden.</Text>
                        </CardContent>
                      </Card>
                    ) : (
                      pastEvents.map(event => <EventCard key={event.id} event={event} navigation={navigation} />)
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

function EventCard({ event, navigation }) {
  const formattedDate = format(parseISO(event.date), 'EEEE, d. MMMM yyyy', { locale: de });

  return (
    <Card style={styles.card}>
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: event.imageUrl || 'https://via.placeholder.com/400x200' }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardImageOverlay} />
        <View style={styles.cardImageContent}>
          <Text style={styles.cardTitle}>{event.name}</Text>
          <View style={styles.dateContainer}>
            <Calendar width={16} height={16} color="#ffffff" />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>
      </View>
      <CardContent>
        <View style={styles.cardContentContainer}>
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
          <Text style={styles.description} numberOfLines={2}>{event.description}</Text>

          <View style={styles.badgeContainer}>
            {event.djs.slice(0, 2).map(dj => (
              <Badge key={dj.id} variant="secondary" style={styles.badge}>
                {dj.name}
              </Badge>
            ))}
            {event.djs.length > 2 && (
              <Badge variant="secondary" style={styles.badge}>
                +{event.djs.length - 2} weitere
              </Badge>
            )}
          </View>

          <View style={styles.cardActions}>
            <Button onPress={() => navigation.navigate('EventDetail', { id: event.id })}>
              Details
            </Button>
          </View>
        </View>
      </CardContent>
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
  tabsContainer: {
    flex: 1,
  },
  tabsList: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabTrigger: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#27272a',
    borderRadius: 4,
  },
  tabTriggerActive: {
    backgroundColor: '#6366f1',
  },
  tabTriggerText: {
    color: '#a1a1aa',
    fontWeight: '500',
    fontSize: 14,
  },
  tabTriggerTextActive: {
    color: '#ffffff',
  },
  tabContent: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    color: '#a1a1aa',
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardImageContainer: {
    position: 'relative',
    height: 160,
    width: '100%',
  },
  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardImageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardImageContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
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
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardContentContainer: {
    gap: 12,
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
    fontSize: 14,
    color: '#ffffff',
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    marginRight: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});