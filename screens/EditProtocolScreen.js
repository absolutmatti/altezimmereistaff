import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Loader2,
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  FileText
} from 'react-native-feather';
import { Picker } from '@react-native-picker/picker';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import { mockMeetings } from '../utils/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/Card';
import { Button } from '../components/Button';

export default function EditProtocolScreen({ route, navigation }) {
  const { meetingId } = route.params;
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [protocol, setProtocol] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const foundMeeting = mockMeetings.find(m => m.id === meetingId);
        if (foundMeeting) {
          setMeeting(foundMeeting);
          setProtocol(foundMeeting.protocol || []);
        } else {
          // Meeting not found, redirect to meetings page
          navigation.navigate('Meetings');
        }
      } catch (error) {
        console.error('Error fetching meeting:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId, navigation]);

  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      title: '',
      content: '',
      type: 'info',
    };

    setProtocol([...protocol, newItem]);
  };

  const handleRemoveItem = (id) => {
    setProtocol(protocol.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id, field, value) => {
    setProtocol(
      protocol.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Validate protocol items
      const invalidItems = protocol.filter(item => !item.title || !item.content);
      if (invalidItems.length > 0) {
        Alert.alert(
          'Fehler beim Speichern',
          'Bitte fülle alle Felder aus.'
        );
        setIsSaving(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Protokoll gespeichert',
        'Das Protokoll wurde erfolgreich gespeichert.',
        [
          { text: 'OK', onPress: () => navigation.navigate('MeetingDetail', { meetingId }) }
        ]
      );
    } catch (error) {
      console.error('Error saving protocol:', error);
      Alert.alert(
        'Fehler beim Speichern',
        'Das Protokoll konnte nicht gespeichert werden.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalize = async () => {
    setIsSaving(true);

    try {
      // Validate protocol items
      const invalidItems = protocol.filter(item => !item.title || !item.content);
      if (invalidItems.length > 0) {
        Alert.alert(
          'Fehler beim Finalisieren',
          'Bitte fülle alle Felder aus.'
        );
        setIsSaving(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Protokoll finalisiert',
        'Das Protokoll wurde erfolgreich finalisiert.',
        [
          { text: 'OK', onPress: () => navigation.navigate('MeetingDetail', { meetingId }) }
        ]
      );
    } catch (error) {
      console.error('Error finalizing protocol:', error);
      Alert.alert(
        'Fehler beim Finalisieren',
        'Das Protokoll konnte nicht finalisiert werden.'
      );
    } finally {
      setIsSaving(false);
    }
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
          <Text style={styles.headerTitle}>Protokoll bearbeiten</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView}>
          <Card style={styles.mainCard}>
            <CardHeader>
              <View style={styles.titleContainer}>
                <FileText width={20} height={20} color="#ffffff" />
                <CardTitle style={styles.cardTitle}>{meeting.title}</CardTitle>
              </View>
              <Text style={styles.cardSubtitle}>
                {formattedDate}, {meeting.startTime} - {meeting.endTime} Uhr
              </Text>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              {protocol.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Noch keine Protokolleinträge vorhanden.</Text>
                  <Text style={styles.emptySubtext}>Klicke auf "Eintrag hinzufügen", um einen neuen Eintrag zu erstellen.</Text>
                </View>
              ) : (
                protocol.map((item, index) => (
                  <Card key={item.id} style={styles.protocolItemCard}>
                    <CardHeader style={styles.protocolItemHeader}>
                      <View style={styles.protocolItemHeaderContent}>
                        <CardTitle style={styles.protocolItemTitle}>Eintrag {index + 1}</CardTitle>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 width={16} height={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </CardHeader>
                    <CardContent style={styles.protocolItemContent}>
                      <View style={styles.formRow}>
                        <View style={styles.formGroup}>
                          <Text style={styles.formLabel}>Titel</Text>
                          <TextInput
                            style={styles.input}
                            value={item.title}
                            onChangeText={(value) => handleUpdateItem(item.id, 'title', value)}
                            placeholder="Titel des Eintrags"
                            placeholderTextColor="#71717a"
                          />
                        </View>
                        <View style={styles.formGroup}>
                          <Text style={styles.formLabel}>Typ</Text>
                          <View style={styles.pickerContainer}>
                            <Picker
                              selectedValue={item.type}
                              onValueChange={(value) => handleUpdateItem(item.id, 'type', value)}
                              dropdownIconColor="#ffffff"
                              style={styles.picker}
                            >
                              <Picker.Item label="Information" value="info" />
                              <Picker.Item label="Entscheidung" value="decision" />
                              <Picker.Item label="Aufgabe" value="task" />
                            </Picker>
                          </View>
                        </View>
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Inhalt</Text>
                        <TextInput
                          style={styles.textArea}
                          value={item.content}
                          onChangeText={(value) => handleUpdateItem(item.id, 'content', value)}
                          placeholder="Inhalt des Eintrags"
                          placeholderTextColor="#71717a"
                          multiline
                          numberOfLines={3}
                          textAlignVertical="top"
                        />
                      </View>

                      {item.type === 'task' && (
                        <View style={styles.formRow}>
                          <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Zugewiesen an</Text>
                            <View style={styles.pickerContainer}>
                              <Picker
                                selectedValue={item.assignedTo?.id}
                                onValueChange={(value) => {
                                  const assignedTo = [...meeting.attendees.map(a => a.user), meeting.createdBy].find(
                                    user => user.id === value
                                  );
                                  handleUpdateItem(item.id, 'assignedTo', assignedTo);
                                }}
                                dropdownIconColor="#ffffff"
                                style={styles.picker}
                              >
                                <Picker.Item label="Person auswählen" value="" />
                                {[...meeting.attendees.map(a => a.user), meeting.createdBy]
                                  .filter((user, index, self) => index === self.findIndex(u => u.id === user.id))
                                  .map(user => (
                                    <Picker.Item key={user.id} label={user.name} value={user.id} />
                                  ))}
                              </Picker>
                            </View>
                          </View>
                          <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Fälligkeitsdatum</Text>
                            <TextInput
                              style={styles.input}
                              value={item.dueDate}
                              onChangeText={(value) => handleUpdateItem(item.id, 'dueDate', value)}
                              placeholder="YYYY-MM-DD"
                              placeholderTextColor="#71717a"
                            />
                          </View>
                        </View>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}

              <Button
                variant="outline"
                style={styles.addButton}
                onPress={handleAddItem}
                icon={<Plus width={16} height={16} color="#ffffff" />}
              >
                Eintrag hinzufügen
              </Button>
            </CardContent>
            <CardFooter style={styles.cardFooter}>
              <Button
                variant="outline"
                style={styles.footerButton}
                onPress={() => navigation.goBack()}
                disabled={isSaving}
              >
                Abbrechen
              </Button>
              <View style={styles.actionButtons}>
                <Button
                  variant="outline"
                  style={styles.footerButton}
                  onPress={handleSave}
                  disabled={isSaving}
                  icon={isSaving ? <Loader2 width={16} height={16} color="#ffffff" className="animate-spin" /> : <Save width={16} height={16} color="#ffffff" />}
                >
                  {isSaving ? 'Speichern...' : 'Speichern'}
                </Button>
                <Button
                  style={styles.footerButton}
                  onPress={handleFinalize}
                  disabled={isSaving}
                >
                  {isSaving ? 'Finalisieren...' : 'Finalisieren'}
                </Button>
              </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 73, // Same width as back button for centering
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  mainCard: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 4,
  },
  cardContent: {
    gap: 16,
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
  emptySubtext: {
    color: '#a1a1aa',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
  protocolItemCard: {
    borderWidth: 1,
    borderColor: '#27272a',
  },
  protocolItemHeader: {
    paddingBottom: 8,
  },
  protocolItemHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  protocolItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  removeButton: {
    padding: 8,
  },
  protocolItemContent: {
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  formGroup: {
    flex: 1,
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#27272a',
    borderRadius: 6,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#27272a',
  },
  picker: {
    color: '#ffffff',
  },
  textArea: {
    backgroundColor: '#27272a',
    borderRadius: 6,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
});