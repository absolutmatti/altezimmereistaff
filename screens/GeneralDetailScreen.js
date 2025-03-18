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

import { mockGeneralPosts } from '../utils/mockData';
import GeneralPostDetail from '../components/GeneralPostDetail';

export default function GeneralDetailScreen({ route, navigation }) {
  const { postId } = route.params;
  const post = mockGeneralPosts.find(p => p.id === postId);

  if (!post) {
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
              <Text style={styles.title}>Post nicht gefunden</Text>
              <View style={styles.spacer}></View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
            <Text style={styles.title}>Post Details</Text>
            <View style={styles.spacer}></View>
          </View>

          <GeneralPostDetail post={post} navigation={navigation} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#ffffff',
    marginLeft: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  spacer: {
    width: 73, // Space to balance the header
  },
});