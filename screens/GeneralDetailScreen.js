import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Send, 
  MoreVertical, 
  Edit, 
  Trash2,
  Heart,
  ThumbsUp,
  Laugh,
  Frown,
  Angry
} from 'react-native-feather';
import { formatDateRelative } from '../utils/dateUtils';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Card, CardContent, CardFooter } from '../components/Card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import * as ImagePicker from 'expo-image-picker';

// Reactions
const reactions = [
  { emoji: "👍", icon: ThumbsUp, label: "Gefällt mir" },
  { emoji: "❤️", icon: Heart, label: "Liebe" },
  { emoji: "😂", icon: Laugh, label: "Lachen" },
  { emoji: "😢", icon: Frown, label: "Traurig" },
  { emoji: "😠", icon: Angry, label: "Wütend" },
];

export default function GeneralDetailScreen({ route, navigation }) {
  const { postId } = route.params;
  // Hier würde man normalerweise den Post über eine API abrufen
  // Für dieses Beispiel nehmen wir an, dass der Post bereits übergeben wurde oder abrufen ihn aus Mock-Daten
  const [post, setPost] = useState(route.params.post || getMockPost(postId));
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [currentReactions, setCurrentReactions] = useState(post.reactions || {});
  const [userReaction, setUserReaction] = useState(null);
  const [showReactionMenu, setShowReactionMenu] = useState(false);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(
        "Berechtigung erforderlich", 
        "Du musst die Zugriffsberechtigung für die Medienbibliothek erteilen."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCommentImage(result.assets[0].uri);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() && !commentImage) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new comment
      const newComment = {
        id: `comment-${Date.now()}`,
        content: commentText,
        author: {
          id: "staff1",
          name: "Max Mustermann",
          profileImage: "https://ui-avatars.com/api/?name=Max+Mustermann",
          isOwner: false,
        },
        createdAt: new Date().toISOString(),
        mediaUrl: commentImage || undefined,
      };

      // Add comment to list
      setComments([...comments, newComment]);

      // Reset form
      setCommentText('');
      setCommentImage(null);

      Alert.alert(
        "Kommentar hinzugefügt",
        "Dein Kommentar wurde erfolgreich hinzugefügt."
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert(
        "Fehler",
        "Dein Kommentar konnte nicht hinzugefügt werden."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      Alert.alert(
        "Post gelöscht",
        "Der Post wurde erfolgreich gelöscht."
      );
      
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert(
        "Fehler",
        "Der Post konnte nicht gelöscht werden."
      );
    }
  };

  const handleReaction = (emoji) => {
    // If user already reacted with this emoji, remove it
    if (userReaction === emoji) {
      setCurrentReactions({
        ...currentReactions,
        [emoji]: Math.max(0, (currentReactions[emoji] || 0) - 1),
      });
      setUserReaction(null);
    }
    // If user reacted with a different emoji, remove old one and add new one
    else if (userReaction) {
      setCurrentReactions({
        ...currentReactions,
        [userReaction]: Math.max(0, (currentReactions[userReaction] || 0) - 1),
        [emoji]: (currentReactions[emoji] || 0) + 1,
      });
      setUserReaction(emoji);
    }
    // If user didn't react yet, add new reaction
    else {
      setCurrentReactions({
        ...currentReactions,
        [emoji]: (currentReactions[emoji] || 0) + 1,
      });
      setUserReaction(emoji);
    }
    
    setShowReactionMenu(false);
  };

  const toggleReactionMenu = () => {
    setShowReactionMenu(!showReactionMenu);
  };

  const showOptionsAlert = () => {
    if (post.author.id === "staff1") {
      Alert.alert(
        "Post-Optionen", 
        "Wähle eine Option",
        [
          {
            text: "Bearbeiten",
            onPress: () => navigation.navigate('EditGeneral', { postId: post.id }),
          },
          {
            text: "Löschen",
            onPress: handleDeletePost,
            style: "destructive"
          },
          {
            text: "Abbrechen",
            style: "cancel"
          }
        ]
      );
    }
  };

  // Format the date
  const formattedDate = format(
    new Date(post.createdAt), 
    "dd. MMMM yyyy 'um' HH:mm 'Uhr'", 
    { locale: de }
  );

  // Get total reactions count
  const totalReactions = Object.values(currentReactions)
    .reduce((sum, count) => sum + count, 0);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView style={styles.scrollView}>
          <Card>
            <CardContent style={styles.postContent}>
              <View style={styles.authorRow}>
                <Avatar size="md" source={post.author.profileImage} fallback={post.author.name.charAt(0)} />
                <View style={styles.authorInfo}>
                  <View style={styles.headerTop}>
                    <Text style={styles.authorName}>{post.author.name}</Text>
                    <View style={styles.headerRight}>
                      <Text style={styles.dateText}>{formattedDate}</Text>
                      
                      {post.author.id === "staff1" && (
                        <TouchableOpacity 
                          style={styles.moreButton}
                          onPress={showOptionsAlert}
                        >
                          <MoreVertical width={16} height={16} color="#a1a1aa" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  
                  {post.categories && post.categories.length > 0 && (
                    <View style={styles.categoryRow}>
                      {post.categories.map(category => (
                        <Badge key={category} variant="secondary" style={styles.badge}>
                          {category}
                        </Badge>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.content}>{post.content}</Text>

              {post.mediaUrl && (
                <Image 
                  source={{ uri: post.mediaUrl }} 
                  style={styles.media}
                  resizeMode="cover"
                />
              )}
            </CardContent>
            
            <CardFooter style={styles.reactionsFooter}>
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

              <View style={styles.reactionsContainer}>
                <View>
                  <TouchableOpacity 
                    style={[
                      styles.reactionButton,
                      userReaction && styles.activeReactionButton
                    ]}
                    onPress={toggleReactionMenu}
                  >
                    <Text style={styles.reactionButtonText}>
                      {userReaction || "👍"}
                    </Text>
                  </TouchableOpacity>
                  
                  {showReactionMenu && (
                    <View style={styles.reactionMenu}>
                      {reactions.map(reaction => (
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
              </View>
            </CardFooter>
          </Card>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <View style={styles.commentHeader}>
              <MessageSquare width={20} height={20} color="#ffffff" />
              <Text style={styles.commentsTitle}>
                Kommentare ({comments.length})
              </Text>
            </View>

            {comments.length > 0 ? (
              <View style={styles.commentsList}>
                {comments.map(comment => (
                  <Card key={comment.id} style={styles.commentCard}>
                    <View style={styles.commentContent}>
                      <Avatar 
                        size="sm" 
                        source={comment.author.profileImage} 
                        fallback={comment.author.name.charAt(0)} 
                      />
                      <View style={styles.commentBody}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentAuthor}>{comment.author.name}</Text>
                          <Text style={styles.commentDate}>
                            {formatDateRelative(comment.createdAt)}
                          </Text>
                        </View>
                        <Text style={styles.commentText}>{comment.content}</Text>
                        {comment.mediaUrl && (
                          <Image 
                            source={{ uri: comment.mediaUrl }} 
                            style={styles.commentMedia}
                            resizeMode="cover"
                          />
                        )}
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>Noch keine Kommentare vorhanden.</Text>
              </Card>
            )}

            {/* Add Comment Form */}
            <Card style={styles.commentFormCard}>
              <CardContent>
                <Text style={styles.formTitle}>Kommentar hinzufügen</Text>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Schreibe einen Kommentar..."
                  placeholderTextColor="#71717a"
                  multiline
                  value={commentText}
                  onChangeText={setCommentText}
                />

                {commentImage && (
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: commentImage }} 
                      style={styles.imagePreview}
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => setCommentImage(null)}
                    >
                      <Text style={styles.removeImageButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </CardContent>
              
              <CardFooter style={styles.commentFormFooter}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handleImagePick}
                >
                  <ImageIcon width={20} height={20} color="#ffffff" />
                </TouchableOpacity>
                
                <Button
                  onPress={handleSubmitComment}
                  disabled={isSubmitting || (!commentText.trim() && !commentImage)}
                  icon={<Send width={16} height={16} color="#ffffff" />}
                >
                  Kommentar senden
                </Button>
              </CardFooter>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Hilfsfunktion, um einen Mock-Post zu erhalten (in einer echten App würde man das über eine API machen)
function getMockPost(postId) {
  return {
    id: postId || "general1",
    content: "Hat jemand ein Akkuschrauber gesehen? Ich kann meinen nicht finden und brauche ihn dringend für den Aufbau der neuen Regale.",
    author: {
      id: "staff2",
      name: "Thomas Schmidt",
      profileImage: "https://ui-avatars.com/api/?name=Thomas+Schmidt",
      isOwner: false,
    },
    createdAt: "2024-12-19T08:45:00Z",
    updatedAt: "2024-12-19T08:45:00Z",
    categories: ["Werkzeug", "Frage"],
    commentCount: 2,
    mediaUrl: null,
    reactions: {
      "👍": 3,
      "❤️": 0,
      "😂": 2,
      "😢": 0,
      "😠": 0
    },
    comments: [
      {
        id: "comment1",
        content: "Ich habe einen in der Werkstatt gesehen, auf dem Regalbrett über der Säge.",
        author: {
          id: "staff1",
          name: "Max Mustermann",
          profileImage: "https://ui-avatars.com/api/?name=Max+Mustermann",
          isOwner: true,
        },
        createdAt: "2024-12-19T09:15:00Z",
        mediaUrl: null,
      },
      {
        id: "comment2",
        content: "Hast du ihn gefunden?",
        author: {
          id: "staff3",
          name: "Erika Musterfrau",
          profileImage: "https://ui-avatars.com/api/?name=Erika+Musterfrau",
          isOwner: false,
        },
        createdAt: "2024-12-19T10:30:00Z",
        mediaUrl: null,
      }
    ]
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  postContent: {
    paddingBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
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
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  badge: {
    marginRight: 4,
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    color: '#d4d4d8',
    marginBottom: 16,
    lineHeight: 24,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  reactionsFooter: {
    flexDirection: 'column',
  },
  reactionsCount: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  reactionCountItem: {
    color: '#a1a1aa',
    fontSize: 14,
    marginRight: 8,
  },
  reactionsContainer: {
    paddingTop: 12,
    position: 'relative',
  },
  reactionButton: {
    padding: 8,
    borderRadius: 4,
  },
  activeReactionButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  reactionButtonText: {
    fontSize: 18,
  },
  reactionMenu: {
    position: 'absolute',
    top: -50,
    left: 0,
    flexDirection: 'row',
    backgroundColor: '#27272a',
    borderRadius: 24,
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  reactionMenuItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeReactionItem: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  reactionEmoji: {
    fontSize: 22,
  },
  commentsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  commentsList: {
    marginBottom: 16,
  },
  commentCard: {
    marginBottom: 12,
  },
  commentContent: {
    flexDirection: 'row',
    padding: 16,
  },
  commentBody: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  commentDate: {
    fontSize: 12,
    color: '#71717a',
  },
  commentText: {
    fontSize: 14,
    color: '#d4d4d8',
    marginTop: 4,
  },
  commentMedia: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 12,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: '#71717a',
  },
  commentFormCard: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    marginTop: 12,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 16,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  commentFormFooter: {
    justifyContent: 'space-between',
  },
  imageButton: {
    backgroundColor: '#27272a',
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});