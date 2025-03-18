// screens/PlaceholderScreens.js
// Dieser Code enthält einfache Platzhalter-Screens für Navigation und Testing

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components/Button';

// Import the actual implementations
import NewsDetailScreenImpl from './NewsDetailScreen';
import GeneralDetailScreenImpl from './GeneralDetailScreen';
import CreateNewsScreenImpl from './CreateNewsScreen';
import CreateGeneralScreenImpl from './CreateGeneralScreen';
import EditNewsScreenImpl from './EditNewsScreen';
import EditGeneralScreenImpl from './EditGeneralScreen';

// Export the actual implementations
export const NewsDetailScreen = NewsDetailScreenImpl;
export const GeneralDetailScreen = GeneralDetailScreenImpl;
export const CreateNewsScreen = CreateNewsScreenImpl;
export const CreateGeneralScreen = CreateGeneralScreenImpl;
export const EditNewsScreen = EditNewsScreenImpl;
export const EditGeneralScreen = EditGeneralScreenImpl;

// Placeholder Screens - these need different names to avoid conflicts
// Placeholder für News-Detail-Screen
export function NewsDetailPlaceholder({ route, navigation }) {
  const { postId } = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>News Detail</Text>
      <Text style={styles.subtitle}>Post ID: {postId}</Text>
      <Button 
        variant="outline" 
        onPress={() => navigation.goBack()}
      >
        Zurück
      </Button>
    </View>
  );
}

// Placeholder für General-Detail-Screen
export function GeneralDetailPlaceholder({ route, navigation }) {
  const { postId } = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>General Post Detail</Text>
      <Text style={styles.subtitle}>Post ID: {postId}</Text>
      <Button 
        variant="outline" 
        onPress={() => navigation.goBack()}
      >
        Zurück
      </Button>
    </View>
  );
}

// Placeholder für Create-News-Screen
export function CreateNewsPlaceholder({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neue Neuigkeit erstellen</Text>
      <Text style={styles.subtitle}>Dieses Feature ist noch in Entwicklung</Text>
      <Button 
        variant="outline" 
        onPress={() => navigation.goBack()}
      >
        Zurück
      </Button>
    </View>
  );
}

// Placeholder für Create-General-Screen
export function CreateGeneralPlaceholder({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neuen allgemeinen Post erstellen</Text>
      <Text style={styles.subtitle}>Dieses Feature ist noch in Entwicklung</Text>
      <Button 
        variant="outline" 
        onPress={() => navigation.goBack()}
      >
        Zurück
      </Button>
    </View>
  );
}

// Placeholder für Edit-General-Screen
export function EditGeneralPlaceholder({ route, navigation }) {
  const { postId } = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>General Post bearbeiten</Text>
      <Text style={styles.subtitle}>Post ID: {postId}</Text>
      <Text style={styles.subtitle}>Dieses Feature ist noch in Entwicklung</Text>
      <Button 
        variant="outline" 
        onPress={() => navigation.goBack()}
      >
        Zurück
      </Button>
    </View>
  );
}

// Placeholder für Login-Screen
export function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Dieses Feature ist noch in Entwicklung</Text>
      <Button 
        variant="outline" 
        onPress={() => navigation.navigate('Dashboard')}
      >
        Zum Dashboard
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#18181b',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 24,
    textAlign: 'center',
  },
});