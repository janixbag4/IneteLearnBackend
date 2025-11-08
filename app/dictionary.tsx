// app/dictionary.tsx - WITH ONLINE/OFFLINE TOGGLE
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { API_URL } from '../inetelearn-backend/config/api'; // ← FIXED import path

const { width, height } = Dimensions.get('window');

interface Word {
  _id: string;
  inete: string;
  hiligaynon: string;
  english: string;
  pronunciation?: string;
  partOfSpeech?: string;
  definitionInete?: string;
  definitionHiligaynon?: string;
  definitionEnglish?: string;
  exampleInete?: string;
  exampleHiligaynon?: string;
  exampleEnglish?: string;
}

export default function DictionaryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [useOfflineMode, setUseOfflineMode] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    checkOfflineData();
  }, []);

  const checkOfflineData = async () => {
    const offlineData = await AsyncStorage.getItem('offlineDictionary');
    setHasOfflineData(!!offlineData);
    // Auto-enable offline mode if offline data exists
    if (offlineData) {
      setUseOfflineMode(true);
    }
  };

  const speak = async (text: string, language: 'en' | 'fil' = 'en') => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    await Speech.speak(text, {
      language: language === 'fil' ? 'fil-PH' : 'en-US',
      pitch: 1.0,
      rate: 0.8,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const searchWords = async (query: string) => {
    if (!query.trim()) {
      setWords([]);
      return;
    }

    setIsLoading(true);
    try {
      // Check if user wants to use offline mode AND has offline data
      if (useOfflineMode && hasOfflineData) {
        const offlineData = await AsyncStorage.getItem('offlineDictionary');
        if (offlineData) {
          const { words: offlineWords } = JSON.parse(offlineData);
          
          const filtered = offlineWords.filter((word: Word) => {
            const searchLower = query.toLowerCase();
            return (
              word.inete?.toLowerCase().includes(searchLower) ||
              word.hiligaynon?.toLowerCase().includes(searchLower) ||
              word.english?.toLowerCase().includes(searchLower)
            );
          });
          
          setWords(filtered);
          console.log('✅ Offline search:', filtered.length, 'results');
        }
      } else {
        // Use online mode
        console.log('🌐 Searching online:', `${API_URL}/api/dictionary/search?query=${encodeURIComponent(query)}`);
        const response = await fetch(`${API_URL}/api/dictionary/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setWords(data);
        console.log('🌐 Online search:', data.length, 'results');
      }
    } catch (error) {
      console.error('Search error:', error);
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    searchWords(text);
  };

  // Re-search when offline mode is toggled
  useEffect(() => {
    if (searchQuery.trim()) {
      searchWords(searchQuery);
    }
  }, [useOfflineMode]);

  const renderWordItem = ({ item }: { item: Word }) => (
    <TouchableOpacity
      style={styles.wordCard}
      onPress={() => setSelectedWord(item)}
      activeOpacity={0.7}>
      <View style={styles.wordHeader}>
        <View style={styles.wordTitleRow}>
          <ThemedText style={styles.wordText}>{item.inete}</ThemedText>
          <TouchableOpacity
            style={styles.speakerIcon}
            onPress={() => speak(item.inete, 'fil')}>
            <Ionicons 
              name={isSpeaking ? "volume-high" : "volume-medium-outline"} 
              size={20} 
              color="#8B4513" 
            />
          </TouchableOpacity>
        </View>
        {item.pronunciation && (
          <ThemedText style={styles.pronunciation}>/{item.pronunciation}/</ThemedText>
        )}
      </View>
      
      <View style={styles.translations}>
        <View style={styles.translationRow}>
          <ThemedText style={styles.languageLabel}>Hiligaynon:</ThemedText>
          <ThemedText style={styles.translationText}>{item.hiligaynon}</ThemedText>
        </View>
        <View style={styles.translationRow}>
          <ThemedText style={styles.languageLabel}>English:</ThemedText>
          <ThemedText style={styles.translationText}>{item.english}</ThemedText>
        </View>
      </View>
      
      {item.partOfSpeech && (
        <ThemedText style={styles.partOfSpeech}>{item.partOfSpeech}</ThemedText>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8B4513" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search in Inete, Hiligaynon, or English..."
          placeholderTextColor="#A0826D"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#8B4513" />
          </TouchableOpacity>
        )}
      </View>

      {/* Offline/Online Toggle */}
      {hasOfflineData && (
        <View style={styles.modeToggle}>
          <View style={styles.modeLeft}>
            <Ionicons 
              name={useOfflineMode ? "cloud-offline" : "cloud-done"} 
              size={20} 
              color={useOfflineMode ? "#4CAF50" : "#2196F3"} 
            />
            <ThemedText style={styles.modeText}>
              {useOfflineMode ? 'Offline Mode' : 'Online Mode'}
            </ThemedText>
          </View>
          <Switch
            value={useOfflineMode}
            onValueChange={setUseOfflineMode}
            trackColor={{ false: '#D2B48C', true: '#4CAF50' }}
            thumbColor={useOfflineMode ? '#2E7D32' : '#8B4513'}
          />
        </View>
      )}

      <View style={styles.languageIndicator}>
        <View style={styles.languageBadge}>
          <ThemedText style={styles.badgeText}>Inete</ThemedText>
        </View>
        <Ionicons name="swap-horizontal" size={20} color="#8B4513" />
        <View style={styles.languageBadge}>
          <ThemedText style={styles.badgeText}>Hiligaynon</ThemedText>
        </View>
        <Ionicons name="swap-horizontal" size={20} color="#8B4513" />
        <View style={styles.languageBadge}>
          <ThemedText style={styles.badgeText}>English</ThemedText>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
          <ThemedText style={styles.loadingText}>Searching...</ThemedText>
        </View>
      ) : searchQuery.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="book-outline" size={width * 0.2} color="#D2B48C" />
          <ThemedText style={styles.emptyTitle}>Trilingual Dictionary</ThemedText>
          <ThemedText style={styles.emptyText}>
            Search for words in Inete, Hiligaynon, or English
          </ThemedText>
          {hasOfflineData && (
            <View style={styles.offlineHint}>
              <Ionicons name="information-circle-outline" size={16} color="#8B4513" />
              <ThemedText style={styles.hintText}>
                Toggle offline mode to search without internet
              </ThemedText>
            </View>
          )}
        </View>
      ) : words.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="sad-outline" size={width * 0.2} color="#D2B48C" />
          <ThemedText style={styles.emptyTitle}>No Results Found</ThemedText>
          <ThemedText style={styles.emptyText}>
            Try searching in another language{useOfflineMode && ' or switch to online mode'}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedWord && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <ThemedText style={styles.modalTitle}>{selectedWord.inete}</ThemedText>
                <TouchableOpacity
                  style={styles.modalSpeaker}
                  onPress={() => speak(selectedWord.inete, 'fil')}>
                  <Ionicons 
                    name={isSpeaking ? "volume-high" : "volume-medium"} 
                    size={24} 
                    color="#8B4513" 
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setSelectedWord(null)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />
            
            <ScrollView style={styles.modalBody}>
              {selectedWord.pronunciation && (
                <ThemedText style={styles.detailPronunciation}>
                  /{selectedWord.pronunciation}/
                </ThemedText>
              )}
              
              {selectedWord.partOfSpeech && (
                <ThemedText style={styles.detailPartOfSpeech}>
                  {selectedWord.partOfSpeech}
                </ThemedText>
              )}
              
              <View style={styles.translationsDetail}>
                <View style={styles.translationDetailRow}>
                  <View style={styles.translationHeaderRow}>
                    <ThemedText style={styles.detailLabel}>Hiligaynon:</ThemedText>
                    <TouchableOpacity onPress={() => speak(selectedWord.hiligaynon, 'fil')}>
                      <Ionicons name="volume-medium-outline" size={18} color="#8B4513" />
                    </TouchableOpacity>
                  </View>
                  <ThemedText style={styles.detailTranslation}>
                    {selectedWord.hiligaynon}
                  </ThemedText>
                </View>
                
                <View style={styles.translationDetailRow}>
                  <View style={styles.translationHeaderRow}>
                    <ThemedText style={styles.detailLabel}>English:</ThemedText>
                    <TouchableOpacity onPress={() => speak(selectedWord.english, 'en')}>
                      <Ionicons name="volume-medium-outline" size={18} color="#8B4513" />
                    </TouchableOpacity>
                  </View>
                  <ThemedText style={styles.detailTranslation}>
                    {selectedWord.english}
                  </ThemedText>
                </View>
              </View>
              
              {(selectedWord.definitionInete || selectedWord.definitionHiligaynon || selectedWord.definitionEnglish) && (
                <View style={styles.definitionsSection}>
                  <ThemedText style={styles.sectionTitle}>Definitions</ThemedText>
                  
                  {selectedWord.definitionInete && (
                    <View style={styles.defBlock}>
                      <ThemedText style={styles.defLabel}>Inete:</ThemedText>
                      <ThemedText style={styles.defText}>{selectedWord.definitionInete}</ThemedText>
                    </View>
                  )}
                  
                  {selectedWord.definitionHiligaynon && (
                    <View style={styles.defBlock}>
                      <ThemedText style={styles.defLabel}>Hiligaynon:</ThemedText>
                      <ThemedText style={styles.defText}>{selectedWord.definitionHiligaynon}</ThemedText>
                    </View>
                  )}
                  
                  {selectedWord.definitionEnglish && (
                    <View style={styles.defBlock}>
                      <ThemedText style={styles.defLabel}>English:</ThemedText>
                      <ThemedText style={styles.defText}>{selectedWord.definitionEnglish}</ThemedText>
                    </View>
                  )}
                </View>
              )}
              
              {(selectedWord.exampleInete || selectedWord.exampleHiligaynon || selectedWord.exampleEnglish) && (
                <View style={styles.examplesSection}>
                  <ThemedText style={styles.sectionTitle}>Examples</ThemedText>
                  
                  {selectedWord.exampleInete && (
                    <View style={styles.exampleBlock}>
                      <ThemedText style={styles.exampleLabel}>Inete:</ThemedText>
                      <ThemedText style={styles.exampleText}>"{selectedWord.exampleInete}"</ThemedText>
                    </View>
                  )}
                  
                  {selectedWord.exampleHiligaynon && (
                    <View style={styles.exampleBlock}>
                      <ThemedText style={styles.exampleLabel}>Hiligaynon:</ThemedText>
                      <ThemedText style={styles.exampleText}>"{selectedWord.exampleHiligaynon}"</ThemedText>
                    </View>
                  )}
                  
                  {selectedWord.exampleEnglish && (
                    <View style={styles.exampleBlock}>
                      <ThemedText style={styles.exampleLabel}>English:</ThemedText>
                      <ThemedText style={styles.exampleText}>"{selectedWord.exampleEnglish}"</ThemedText>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    margin: width * 0.04,
    paddingHorizontal: width * 0.04,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: height * 0.06,
    fontSize: width * 0.04,
    color: '#5D4E37',
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8DC',
    marginHorizontal: width * 0.04,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  modeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeText: {
    fontSize: width * 0.038,
    fontWeight: '600',
    color: '#5D4E37',
  },
  languageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.04,
    marginBottom: height * 0.02,
    gap: 8,
  },
  languageBadge: {
    backgroundColor: '#F5F5DC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  badgeText: {
    fontSize: width * 0.03,
    color: '#8B4513',
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.08,
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: '#8B4513',
  },
  emptyTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  emptyText: {
    fontSize: width * 0.04,
    color: '#A0826D',
    textAlign: 'center',
  },
  offlineHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  hintText: {
    fontSize: width * 0.033,
    color: '#8B4513',
    fontStyle: 'italic',
  },
  // ... (keep all other existing styles from previous version)
  listContainer: {
    padding: width * 0.04,
    paddingTop: 0,
  },
  wordCard: {
    backgroundColor: '#FFF8DC',
    padding: width * 0.04,
    borderRadius: 12,
    marginBottom: height * 0.015,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  wordHeader: {
    marginBottom: height * 0.015,
  },
  wordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.005,
  },
  wordText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#5D4E37',
    flex: 1,
  },
  speakerIcon: {
    padding: 4,
  },
  pronunciation: {
    fontSize: width * 0.035,
    color: '#8B4513',
    fontStyle: 'italic',
  },
  translations: {
    gap: 6,
    marginBottom: height * 0.01,
  },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageLabel: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#8B4513',
    minWidth: width * 0.22,
  },
  translationText: {
    fontSize: width * 0.038,
    color: '#5D4E37',
    flex: 1,
  },
  partOfSpeech: {
    fontSize: width * 0.033,
    color: '#A0826D',
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#FFFEF0',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: '#F5F5DC',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#5D4E37',
  },
  modalSpeaker: {
    padding: 4,
  },
  divider: {
    height: 2,
    backgroundColor: '#D2B48C',
  },
  modalBody: {
    padding: width * 0.05,
  },
  detailPronunciation: {
    fontSize: width * 0.045,
    color: '#8B4513',
    fontStyle: 'italic',
    marginBottom: height * 0.01,
  },
  detailPartOfSpeech: {
    fontSize: width * 0.035,
    color: '#A0826D',
    fontStyle: 'italic',
    marginBottom: height * 0.02,
  },
  translationsDetail: {
    backgroundColor: '#F5F5DC',
    padding: width * 0.04,
    borderRadius: 8,
    marginBottom: height * 0.02,
    gap: 12,
  },
  translationDetailRow: {
    gap: 4,
  },
  translationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  detailTranslation: {
    fontSize: width * 0.045,
    color: '#5D4E37',
    fontWeight: '600',
  },
  definitionsSection: {
    marginBottom: height * 0.02,
  },
  examplesSection: {
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: height * 0.015,
  },
  defBlock: {
    marginBottom: height * 0.015,
  },
  defLabel: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 4,
  },
  defText: {
    fontSize: width * 0.038,
    color: '#5D4E37',
    lineHeight: 22,
  },
  exampleBlock: {
    marginBottom: height * 0.015,
    paddingLeft: width * 0.03,
    borderLeftWidth: 3,
    borderLeftColor: '#D2B48C',
  },
  exampleLabel: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: width * 0.038,
    color: '#5D4E37',
    fontStyle: 'italic',
    lineHeight: 22,
  },
});
