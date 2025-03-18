import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MessageSquare, MoreHorizontal } from 'react-native-feather';
import { formatDateRelative } from '../utils/dateUtils';
import { getPlatformSpecificValue } from '../utils/utils';

// Reactions
const reactions = [
  { emoji: "👍", label: "Gefällt mir" },
  { emoji: "❤️", label: "Liebe" },
  { emoji: "😂", label: "Lachen" },
  { emoji: "😢", label: "Traurig" },
  { emoji: "😠", label: "Wütend" },
];

export default function GeneralPostCard({ post }) {
  const { 
    id, 
    content, 
    author, 
    createdAt, 
    categories = [], 
    commentCount, 
    mediaUrl, 
    reactions: postReactions 
  } = post;

  const navigation = useNavigation();
  
  const [currentReactions, setCurrentReactions] = useState(postReactions || {});
  const [userReaction, setUserReaction] = useState(null);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  
  // Format the date
  const formattedDate = formatDateRelative(createdAt);

  // Get total reactions count
  const totalReactions = Object.values(currentReactions)
    .reduce((sum, count) => sum + count, 0);

  const handleReaction = (emoji) => {
    // If user already reacted with this emoji, remove it
    if (userReaction === emoji) {
      setCurrentReactions({
        ...currentReactions,
        [emoji]: Math.max(0, (currentReactions[emoji] || 0) - 1)
      });
      setUserReaction(null);
    }
    // If user reacted with a different emoji, remove old one and add new one
    else if (userReaction) {
      setCurrentReactions({
        ...currentReactions,
        [userReaction]: Math.max(0, (currentReactions[userReaction] || 0) - 1),
        [emoji]: (currentReactions[emoji] || 0) + 1
      });
      setUserReaction(emoji);
    }
    // If user didn't react yet, add new reaction
    else {
      setCurrentReactions({
        ...currentReactions,
        [emoji]: (currentReactions[emoji] || 0) + 1
      });
      setUserReaction(emoji);
    }
    
    setShowReactionMenu(false);
  };

  const toggleReactionMenu = () => {
    setShowReactionMenu(!showReactionMenu);
  };

  const showOptions = () => {
    Alert.alert(
      "Post Optionen",
      "Wähle eine Option",
      [
        { text: "Zum Post", onPress: () => navigation.navigate('GeneralDetail', { postId: id }) },
        ...(author.id === "staff1" ? [
          { text: "Bearbeiten", onPress: () => navigation.navigate('EditGeneral', { postId: id }) },
          { text: "Löschen", onPress: () => Alert.alert("Löschen", "Diese Funktion ist noch nicht implementiert") }
        ] : []),
        { text: "Abbrechen", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
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
          
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Text style={styles.authorName}>{author.name}</Text>
              <View style={styles.headerRight}>
                <Text style={styles.dateText}>{formattedDate}</Text>
                <TouchableOpacity onPress={showOptions} style={styles.moreButton}>
                  <MoreHorizontal width={16} height={16} color="#a1a1aa" />
                </TouchableOpacity>
              </View>
            </View>
            
            {categories.length > 0 && (
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <View key={category} style={styles.badge}>
                    <Text style={styles.badgeText}>{category}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <Text style={styles.content}>{content}</Text>

        {mediaUrl && (
          <Image
            source={{ uri: mediaUrl }}
            style={styles.media}
            resizeMode="cover"
          />
        )}
      </View>

      <View style={styles.cardFooter}>
        {totalReactions > 0 && (
          <View style={styles.reactionsCount}>
            {Object.entries(currentReactions)
              .filter(([_, count]) => count > 0)
              .map(([emoji, count]) => (
                <Text key={emoji} style={styles.reactionCountItem}>
                  {emoji} {count}
                </Text>
              ))}
          </View>
        )}

        <View style={styles.footerActions}>
          <View style={styles.reactionsContainer}>
            <TouchableOpacity 
              style={styles.reactionButton} 
              onPress={toggleReactionMenu}
            >
              <Text style={[
                styles.reactionButtonText,
                userReaction && styles.activeReaction
              ]}>
                {userReaction || "👍"}
              </Text>
            </TouchableOpacity>

            {showReactionMenu && (
              <View style={styles.reactionMenu}>
                {reactions.map((reaction) => (
                  <TouchableOpacity
                    key={reaction.emoji}
                    style={[
                      styles.reactionMenuItem,
                      userReaction === reaction.emoji && styles.activeReactionItem
                    ]}
                    onPress={() => handleReaction(reaction.emoji)}
                  >
                    <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.commentButton}
            onPress={() => navigation.navigate('GeneralDetail', { postId: id })}
          >
            <MessageSquare width={16} height={16} color="#a1a1aa" />
            <Text style={styles.commentCount}>{commentCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
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
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontWeight: '600',
    color: '#ffffff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#71717a',
    marginRight: 8,
  },
  moreButton: {
    padding: 4,
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
  content: {
    color: '#ffffff',
    marginBottom: 12,
  },
  media: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginTop: 8,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  reactionsCount: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  reactionCountItem: {
    color: '#a1a1aa',
    fontSize: 12,
    marginRight: 8,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reactionsContainer: {
    position: 'relative',
  },
  reactionButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  reactionButtonText: {
    fontSize: 16,
  },
  activeReaction: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  reactionMenu: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    flexDirection: 'row',
    backgroundColor: '#27272a',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 4,
    ...getPlatformSpecificValue({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  reactionMenuItem: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeReactionItem: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  reactionEmoji: {
    fontSize: 20,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  commentCount: {
    color: '#a1a1aa',
    fontSize: 14,
    marginLeft: 4,
  },
});