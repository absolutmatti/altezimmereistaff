import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Import als Namespace statt einzelner Komponenten
import * as Feather from 'react-native-feather';
import { formatDateRelative } from '../utils/dateUtils';
import { getPlatformSpecificValue } from '../utils/utils';

export default function NewsPostCard({ post }) {
  const { 
    id, 
    title, 
    content, 
    author, 
    createdAt, 
    important, 
    pinned, 
    categories, 
    commentCount, 
    hasVoting, 
    mediaUrl 
  } = post;

  const navigation = useNavigation();
  
  // Format the date
  const formattedDate = formatDateRelative(createdAt);

  // Truncate content if it's too long
  const truncatedContent = content.length > 150 ? content.substring(0, 150) + "..." : content;

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        pinned && styles.pinnedCard
      ]}
      onPress={() => navigation.navigate('NewsDetail', { postId: id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            {author.profileImage ? (
              <Image 
                source={{ uri: author.profileImage }} 
                style={styles.avatarImage} 
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{author.name.charAt(0)}</Text>
              </View>
            )}
          </View>
          <View style={styles.authorInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{author.name}</Text>
              {important && (
                <Feather.AlertTriangle 
                  width={16} 
                  height={16} 
                  color="#ef4444" 
                  style={styles.icon} 
                />
              )}
              {pinned && (
                <Feather.Pin 
                  width={16} 
                  height={16} 
                  color="#6366f1" 
                  style={styles.icon} 
                />
              )}
            </View>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>
        
        {categories && categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <View key={category} style={styles.badge}>
                <Text style={styles.badgeText}>{category}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{truncatedContent}</Text>

        {mediaUrl && (
          <Image
            source={{ uri: mediaUrl }}
            style={styles.media}
            resizeMode="cover"
          />
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerStats}>
          <View style={styles.statItem}>
            <Feather.MessageSquare width={16} height={16} color="#71717a" />
            <Text style={styles.statText}>{commentCount}</Text>
          </View>
          {hasVoting && (
            <View style={styles.statItem}>
              <Feather.BarChart3 width={16} height={16} color="#71717a" />
              <Text style={styles.statText}>Umfrage</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => navigation.navigate('NewsDetail', { postId: id })}
        >
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#18181b',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272a',
    ...getPlatformSpecificValue({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  pinnedCard: {
    borderColor: '#6366f1',
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#27272a',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b5563',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 4,
  },
  icon: {
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#27272a',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    color: '#d4d4d8',
    fontSize: 10,
  },
  cardContent: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  content: {
    color: '#a1a1aa',
    marginBottom: 12,
  },
  media: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  footerStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: '#71717a',
    fontSize: 12,
    marginLeft: 4,
  },
  detailsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  detailsButtonText: {
    color: '#6366f1',
    fontWeight: '500',
    fontSize: 14,
  },
});