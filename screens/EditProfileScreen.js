import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'react-native-feather';

import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import EditProfileForm from '../components/profile/EditProfileForm';

export default function EditProfileScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft width={20} height={20} color="#ffffff" />
              <Text style={styles.backButtonText}>Zurück</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Profil bearbeiten</Text>
            <View style={styles.spacer}></View>
          </View>

          <Card style={styles.formCard}>
            <CardHeader>
              <Text style={styles.cardTitle}>Profil bearbeiten</Text>
              <Text style={styles.cardDescription}>
                Aktualisiere deine persönlichen Informationen
              </Text>
            </CardHeader>
            <CardContent>
              <EditProfileForm navigation={navigation} />
            </CardContent>
          </Card>
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
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    paddingTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  spacer: {
    width: 70, // Approximate width of back button for centering
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 4,
  },
});