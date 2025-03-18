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

import { Card, CardContent, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Separator } from '../components/Separator';
import ProfileInfo from '../components/profile/ProfileInfo';

export default function ProfileScreen({ navigation }) {
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
              onPress={() => navigation.navigate('Dashboard')}
            >
              <ChevronLeft width={20} height={20} color="#ffffff" />
              <Text style={styles.backButtonText}>Zurück</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Mein Profil</Text>
            <View style={styles.spacer}></View>
          </View>

          <Card style={styles.profileCard}>
            <CardHeader>
              <Text style={styles.cardTitle}>Profil Informationen</Text>
              <Text style={styles.cardDescription}>
                Deine persönlichen Daten und Kontaktinformationen
              </Text>
            </CardHeader>
            <CardContent>
              <ProfileInfo />
            </CardContent>
            <CardFooter style={styles.cardFooter}>
              <Button 
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                Profil bearbeiten
              </Button>
              <Separator style={styles.separator} />
              <Button 
                variant="outline"
                style={styles.changePasswordButton}
                onPress={() => navigation.navigate('ChangePassword')}
              >
                Passwort ändern
              </Button>
            </CardFooter>
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
  profileCard: {
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
  cardFooter: {
    flexDirection: 'column',
  },
  editButton: {
    width: '100%',
  },
  separator: {
    marginVertical: 12,
  },
  changePasswordButton: {
    width: '100%',
  },
});