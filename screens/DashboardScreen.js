import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '../components/Button';
import NewsFeed from '../components/NewsFeed';
import GeneralFeed from '../components/GeneralFeed';

export default function DashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Alte Zimmerei</Text>
            <View style={styles.buttonGroup}>
              <Button 
                variant="ghost" 
                size="sm" 
                onPress={() => navigation.navigate('Profile')}
              >
                Profil
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onPress={() => navigation.navigate('Login')}
              >
                Abmelden
              </Button>
            </View>
          </View>

          <View style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === 'news' && styles.tabTriggerActive,
                ]}
                onPress={() => setActiveTab('news')}
              >
                <Text style={[
                  styles.tabTriggerText,
                  activeTab === 'news' && styles.tabTriggerTextActive,
                ]}>
                  Neuigkeiten
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === 'general' && styles.tabTriggerActive,
                ]}
                onPress={() => setActiveTab('general')}
              >
                <Text style={[
                  styles.tabTriggerText,
                  activeTab === 'general' && styles.tabTriggerTextActive,
                ]}>
                  Allgemein
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tabContent}>
              {activeTab === 'news' && <NewsFeed />}
              {activeTab === 'general' && <GeneralFeed />}
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
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
  },
  tabTriggerTextActive: {
    color: '#ffffff',
  },
  tabContent: {
    flex: 1,
  },
});