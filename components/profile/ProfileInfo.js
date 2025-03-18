import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { 
  User, 
  Phone 
} from 'react-native-feather';

import { Avatar, AvatarFallback } from '../Avatar';
import { Card } from '../Card';

// Mock Benutzerdaten - in einer echten App würden diese vom Authentifizierungssystem kommen
const mockProfileData = {
  name: "Max Mustermann",
  email: "max@altezimmerei.de",
  phone: "+49 123 4567890",
  profileImage: "https://ui-avatars.com/api/?name=Max+Mustermann"
};

export default function ProfileInfo() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API-Aufruf simulieren
    const fetchProfile = async () => {
      try {
        // In einer echten App wäre dies ein API-Aufruf, um das Benutzerprofil zu erhalten
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Demo-Daten
        setProfile(mockProfileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profil konnte nicht geladen werden.</Text>
      </View>
    );
  }

  // Initialen für Avatar Fallback erstellen
  const initials = profile.name
    .split(" ")
    .map(n => n[0])
    .join("");

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar 
          size="xl" 
          source={profile.profileImage}
          fallback={initials}
          style={styles.avatar}
        />
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>{profile.name}</Text>
        <Text style={styles.emailText}>{profile.email}</Text>
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoContent}>
          <View style={styles.infoRow}>
            <User width={20} height={20} color="#a1a1aa" style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{profile.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Phone width={20} height={20} color="#a1a1aa" style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Telefon</Text>
              <Text style={styles.infoValue}>{profile.phone || "Nicht angegeben"}</Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorText: {
    color: '#a1a1aa',
    textAlign: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  infoCard: {
    width: '100%',
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
  },
  infoContent: {
    padding: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    opacity: 0.7,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
  },
});