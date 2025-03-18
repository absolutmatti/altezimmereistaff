import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, UserCircle } from 'react-native-feather';

import GeneralSchedule from '../components/schedule/GeneralSchedule';
import PersonalSchedule from '../components/schedule/PersonalSchedule';

export default function ScheduleScreen() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Dienstplan</Text>
          </View>
          
          <View style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === 'general' && styles.activeTabTrigger,
                ]}
                onPress={() => setActiveTab('general')}
              >
                <Calendar width={16} height={16} color={activeTab === 'general' ? '#ffffff' : '#a1a1aa'} />
                <Text style={[
                  styles.tabTriggerText,
                  activeTab === 'general' && styles.activeTabTriggerText,
                ]}>
                  Allgemeiner Dienstplan
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === 'personal' && styles.activeTabTrigger,
                ]}
                onPress={() => setActiveTab('personal')}
              >
                <UserCircle width={16} height={16} color={activeTab === 'personal' ? '#ffffff' : '#a1a1aa'} />
                <Text style={[
                  styles.tabTriggerText,
                  activeTab === 'personal' && styles.activeTabTriggerText,
                ]}>
                  Meine Dienste
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.tabContent}>
              {activeTab === 'general' && <GeneralSchedule />}
              {activeTab === 'personal' && <PersonalSchedule />}
            </ScrollView>
          </View>
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
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
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
    fontSize: 13,
  },
  activeTabTriggerText: {
    color: '#ffffff',
  },
  tabContent: {
    flex: 1,
  },
});