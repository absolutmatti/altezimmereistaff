import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import ResetPasswordForm from '../components/profile/ResetPasswordForm';

export default function ResetPasswordScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Alte Zimmerei</Text>
            <Text style={styles.subtitle}>Passwort zurücksetzen</Text>
          </View>
          
          <Card style={styles.card}>
            <CardHeader>
              <Text style={styles.cardTitle}>Passwort zurücksetzen</Text>
              <Text style={styles.cardDescription}>
                Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen deines Passworts zu erhalten.
              </Text>
            </CardHeader>
            
            <CardContent>
              <ResetPasswordForm />
            </CardContent>
            
            <CardFooter style={styles.cardFooter}>
              <Button 
                variant="link" 
                onPress={() => navigation.navigate('Login')}
              >
                Zurück zum Login
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 4,
  },
  cardFooter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});