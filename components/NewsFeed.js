import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, Plus, X, Filter } from 'react-native-feather';
import { mockNewsPosts } from '../utils/mockData';
import NewsPostCard from './NewsPostCard';

// Mock function to check if user is an owner
const isOwner = () => true;

export default function NewsFeed() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Get unique categories from posts
  const categories = Array.from(
    new Set(mockNewsPosts.flatMap(post => post.categories || []))
  );

  useEffect(() => {
    // Simulate fetching posts
    const fetchPosts = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPosts(mockNewsPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query and selected category
  const filteredPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(post => 
      !selectedCategory || 
      (post.categories && post.categories.includes(selectedCategory))
    );

  // Sort posts: pinned first, then by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const clearFilter = () => {
    setSelectedCategory(null);
  };
  
  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={toggleFilterModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Kategorien</Text>
            <TouchableOpacity onPress={toggleFilterModal} style={styles.closeButton}>
              <X width={20} height={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[
              styles.categoryItem,
              !selectedCategory && styles.selectedCategoryItem
            ]}
            onPress={() => {
              setSelectedCategory(null);
              toggleFilterModal();
            }}
          >
            <Text style={[
              styles.categoryText,
              !selectedCategory && styles.selectedCategoryText
            ]}>
              Alle Kategorien
            </Text>
          </TouchableOpacity>
          
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryItem,
                selectedCategory === category && styles.selectedCategoryItem
              ]}
              onPress={() => {
                setSelectedCategory(category);
                toggleFilterModal();
              }}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Neuigkeiten</Text>
        {isOwner() && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateNews')}
          >
            <Plus width={16} height={16} color="#ffffff" />
            <Text style={styles.addButtonText}>Neuer Post</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search width={16} height={16} color="#71717a" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Suchen..."
            placeholderTextColor="#71717a"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={toggleFilterModal}
        >
          <Filter width={16} height={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {selectedCategory && (
        <View style={styles.activeFilterContainer}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{selectedCategory}</Text>
            <TouchableOpacity style={styles.clearFilterButton} onPress={clearFilter}>
              <Text style={styles.clearFilterText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {sortedPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery || selectedCategory 
              ? "Keine Ergebnisse gefunden." 
              : "Noch keine Neuigkeiten vorhanden."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedPosts}
          renderItem={({ item }) => <NewsPostCard post={item} />}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: '#ffffff',
  },
  filterButton: {
    backgroundColor: '#27272a',
    borderRadius: 6,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: '#71717a',
    marginRight: 8,
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366f1',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  filterBadgeText: {
    color: '#ffffff',
    fontSize: 12,
  },
  clearFilterButton: {
    marginLeft: 4,
    padding: 2,
  },
  clearFilterText: {
    color: '#ffffff',
    fontSize: 16,
  },
  emptyContainer: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  emptyText: {
    color: '#71717a',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 4,
  },
  selectedCategoryItem: {
    backgroundColor: '#6366f1',
  },
  categoryText: {
    color: '#ffffff',
  },
  selectedCategoryText: {
    fontWeight: '500',
  },
});