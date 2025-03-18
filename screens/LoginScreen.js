import React, { useState } from 'react';
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
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

export default function LoginScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('login');
  
  return (
    <LinearGradient
      colors={['#18181b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Alte Zimmerei</Text>
            <Text style={styles.subtitle}>Staffmember Portal</Text>
          </View>
          
          <View style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === 'login' && styles.activeTabTrigger,
                ]}
                onPress={() => setActiveTab('login')}
              >
                <Text style={[
                  styles.tabTriggerText,
                  activeTab === 'login' && styles.activeTabTriggerText,
                ]}>
                  Login
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === 'register' && styles.activeTabTrigger,
                ]}
                onPress={() => setActiveTab('register')}
              >
                <Text style={[
                  styles.tabTriggerText,
                  activeTab === 'register' && styles.activeTabTriggerText,
                ]}>
                  Registrieren
                </Text>
              </TouchableOpacity>
            </View>
            
            {activeTab === 'login' ? (
              <Card style={styles.card}>
                <CardHeader>
                  <Text style={styles.cardTitle}>Login</Text>
                  <Text style={styles.cardDescription}>
                    Melde dich mit deinen Zugangsdaten an.
                  </Text>
                </CardHeader>
                
                <CardContent>
                  <LoginForm />
                </CardContent>
                
                <CardFooter style={styles.cardFooter}>
                  <Button 
                    variant="link" 
                    onPress={() => navigation.navigate('ResetPassword')}
                  >
                    Passwort vergessen?
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card style={styles.card}>
                <CardHeader>
                  <Text style={styles.cardTitle}>Registrieren</Text>
                  <Text style={styles.cardDescription}>
                    Erstelle ein neues Konto für den Mitarbeiterzugang.
                  </Text>
                </CardHeader>
                
                <CardContent>
                  <RegisterForm />
                </CardContent>
              </Card>
            )}
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
  tabsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  tabsList: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#27272a',
    overflow: 'hidden',
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabTrigger: {
    backgroundColor: '#6366f1',
  },
  tabTriggerText: {
    color: '#a1a1aa',
    fontWeight: '500',
  },
  activeTabTriggerText: {
    color: '#ffffff',
  },
  card: {
    width: '100%',
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