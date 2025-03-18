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
  AlertTriangle, 
  Pin, 
  MessageSquare, 
  Image as ImageIcon, 
  Send, 
  MoreVertical, 
  Edit, 
  Archive, 
  Trash2 
} from 'react-native-feather';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { formatDateRelative } from '../utils/dateUtils';
import { Card, CardContent, CardFooter, CardHeader } from '../components/Card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import VotingSection from '../components/VotingSection';
import * as ImagePicker from 'expo-image-picker';

// Mock function to check if user is an owner
const isOwner = () => true;

export default function NewsDetailScreen({ route, navigation }) {
  const { postId } = route.params;
  // Hier würde man normalerweise den Post über eine API abrufen
  // Für dieses Beispiel nehmen wir an, dass der Post bereits übergeben wurde oder abrufen ihn aus Mock-Daten
  const [post, setPost] = useState(route.params.post || getMockPost(postId));
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

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

  const handlePinPost = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      Alert.alert(
        post.pinned ? "Post nicht mehr angepinnt" : "Post angepinnt",
        post.pinned
          ? "Der Post wurde von der Pinnwand entfernt."
          : "Der Post wurde an die Pinnwand geheftet."
      );
      
      // Update local state
      setPost({...post, pinned: !post.pinned});
    } catch (error) {
      console.error("Error pinning post:", error);
      Alert.alert(
        "Fehler",
        "Die Aktion konnte nicht ausgeführt werden."
      );
    }
  };

  const handleArchivePost = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      Alert.alert(
        "Post archiviert",
        "Der Post wurde erfolgreich archiviert."
      );
      
      navigation.goBack();
    } catch (error) {
      console.error("Error archiving post:", error);
      Alert.alert(
        "Fehler",
        "Der Post konnte nicht archiviert werden."
      );
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

  const showOptionsAlert = () => {
    Alert.alert(
      "Post-Optionen", 
      "Wähle eine Option",
      [
        {
          text: "Bearbeiten",
          onPress: () => navigation.navigate('EditNews', { postId: post.id }),
        },
        {
          text: post.pinned ? "Nicht mehr anpinnen" : "Anpinnen",
          onPress: handlePinPost,
        },
        {
          text: "Archivieren",
          onPress: handleArchivePost,
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
  };

  // Format the date
  const formattedDate = format(
    new Date(post.createdAt), 
    "dd. MMMM yyyy 'um' HH:mm 'Uhr'", 
    { locale: de }
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView style={styles.scrollView}>
          <Card style={styles.card}>
            <CardHeader style={styles.header}>
              <View style={styles.authorRow}>
                <Avatar size="md" source={post.author.profileImage} fallback={post.author.name.charAt(0)} />
                <View style={styles.authorInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.authorName}>{post.author.name}</Text>
                    {post.important && <AlertTriangle width={16} height={16} color="#ef4444" />}
                    {post.pinned && <Pin width={16} height={16} color="#6366f1" />}
                  </View>
                  <View style={styles.categoryRow}>
                    {post.categories?.map(category => (
                      <Badge key={category} variant="secondary" style={styles.badge}>
                        {category}
                      </Badge>
                    ))}
                  </View>
                  <Text style={styles.dateText}>{formattedDate}</Text>
                </View>
                
                {isOwner() && (
                  <TouchableOpacity 
                    style={styles.moreButton}
                    onPress={showOptionsAlert}
                  >
                    <MoreVertical width={16} height={16} color="#a1a1aa" />
                  </TouchableOpacity>
                )}
              </View>
            </CardHeader>
            
            <CardContent>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.content}>{post.content}</Text>

              {post.mediaUrl && (
                <Image 
                  source={{ uri: post.mediaUrl }} 
                  style={styles.media}
                  resizeMode="cover"
                />
              )}

              {post.hasVoting && post.voting && (
                <View style={styles.votingContainer}>
                  <VotingSection voting={post.voting} postId={post.id} />
                </View>
              )}
            </CardContent>
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
    id: postId || "news1",
    title: "Neue Öffnungszeiten ab Januar",
    content: "Ab Januar 2025 ändern sich unsere Öffnungszeiten. Montag bis Freitag sind wir von 8:00 bis 18:00 Uhr für Sie da. Samstags von 9:00 bis 14:00 Uhr.",
    author: {
      id: "staff1",
      name: "Max Mustermann",
      profileImage: "https://ui-avatars.com/api/?name=Max+Mustermann",
      isOwner: true,
    },
    createdAt: "2024-12-18T10:30:00Z",
    updatedAt: "2024-12-18T10:30:00Z",
    categories: ["Allgemein", "Wichtig"],
    important: true,
    pinned: true,
    hasVoting: true,
    mediaUrl: "https://picsum.photos/seed/event1/800/600",
    commentCount: 2,
    comments: [
      {
        id: "comment1",
        content: "Danke für die Information!",
        author: {
          id: "staff2",
          name: "Erika Musterfrau",
          profileImage: "https://ui-avatars.com/api/?name=Erika+Musterfrau",
          isOwner: false,
        },
        createdAt: "2024-12-18T11:35:00Z",
        mediaUrl: null,
      },
      {
        id: "comment2",
        content: "Werden diese Zeiten auch auf der Website aktualisiert?",
        author: {
          id: "staff3",
          name: "Thomas Schmidt",
          profileImage: "https://ui-avatars.com/api/?name=Thomas+Schmidt",
          isOwner: false,
        },
        createdAt: "2024-12-18T14:20:00Z",
        mediaUrl: null,
      }
    ],
    voting: {
      question: "Wie findet ihr die neuen Öffnungszeiten?",
      options: [
        { id: "opt1", text: "Sehr gut", count: 5 },
        { id: "opt2", text: "Gut", count: 3 },
        { id: "opt3", text: "Neutral", count: 1 },
        { id: "opt4", text: "Nicht gut", count: 0 }
      ],
      totalVotes: 9,
      endDate: "2025-01-05T23:59:59Z",
      isEnded: false,
      userVoted: null
    }
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
  card: {
    marginBottom: 24,
  },
  header: {
    paddingBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
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
  dateText: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 4,
  },
  moreButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
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
  votingContainer: {
    marginTop: 24,
  },
  commentsSection: {
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