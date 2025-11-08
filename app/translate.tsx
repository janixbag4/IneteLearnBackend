// app/translate.tsx - WITH ONLINE/OFFLINE TOGGLE & TTS
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { API_URL } from '../inetelearn-backend/config/api'; // ← FIXED import path

const { width, height } = Dimensions.get('window');

interface TranslationResult {
  _id: string;
  inete: string;
  hiligaynon: string;
  english: string;
  definitionInete?: string;
  definitionHiligaynon?: string;
  definitionEnglish?: string;
}

type Language = 'inete' | 'hiligaynon' | 'english';

export default function TranslateScreen() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState<Language>('english');
  const [toLang, setToLang] = useState<Language>('inete');
  const [isTranslating, setIsTranslating] = useState(false);
  const [suggestions, setSuggestions] = useState<TranslationResult[]>([]);
  const [useOfflineMode, setUseOfflineMode] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const languages = [
    { key: 'inete' as Language, label: 'Inete', icon: '🌿' },
    { key: 'hiligaynon' as Language, label: 'Hiligaynon', icon: '🇵🇭' },
    { key: 'english' as Language, label: 'English', icon: '🇺🇸' },
  ];

  useEffect(() => {
    checkOfflineData();
  }, []);

  const checkOfflineData = async () => {
    const offlineData = await AsyncStorage.getItem('offlineDictionary');
    setHasOfflineData(!!offlineData);
    if (offlineData) {
      setUseOfflineMode(true);
    }
  };

  const speak = async (text: string, language: Language) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const lang = language === 'english' ? 'en-US' : 'fil-PH';
    
    await Speech.speak(text, {
      language: lang,
      pitch: 1.0,
      rate: 0.8,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const swapLanguages = () => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const translate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to translate');
      return;
    }

    if (fromLang === toLang) {
      Alert.alert('Error', 'Please select different languages');
      return;
    }

    setIsTranslating(true);
    setSuggestions([]);

    try {
      let results: TranslationResult[] = [];
      
      // Check if user wants to use offline mode AND has offline data
      if (useOfflineMode && hasOfflineData) {
        const offlineData = await AsyncStorage.getItem('offlineDictionary');
        if (offlineData) {
          const { words: offlineWords } = JSON.parse(offlineData);
          
          results = offlineWords.filter((word: TranslationResult) => {
            const searchLower = inputText.trim().toLowerCase();
            return word[fromLang]?.toLowerCase().includes(searchLower);
          });
          
          console.log('✅ Offline translate:', results.length, 'results');
        }
      } else {
        // Use online mode
        console.log('🌐 Translating online');
        const response = await fetch(
          `${API_URL}/api/dictionary/search?query=${encodeURIComponent(inputText.trim())}`
        );
        results = await response.json();
        console.log('🌐 Online translate:', results.length, 'results');
      }

      if (results.length > 0) {
        const exactMatch = results.find(
          (word) => word[fromLang].toLowerCase() === inputText.trim().toLowerCase()
        );

        if (exactMatch) {
          setTranslatedText(exactMatch[toLang]);
          setSuggestions([]);
        } else {
          setSuggestions(results);
          setTranslatedText('');
          Alert.alert(
            'No Exact Match',
            `Found ${results.length} similar word(s). Select from suggestions below.`
          );
        }
      } else {
        setTranslatedText('');
        setSuggestions([]);
        Alert.alert(
          'Not Found',
          useOfflineMode 
            ? 'Word not found in offline dictionary. Try switching to online mode or updating your offline data.'
            : 'This word is not in our dictionary yet. Would you like to contribute it?',
          useOfflineMode ? [{ text: 'OK' }] : [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Contribute', 
              onPress: () => Alert.alert('Info', 'Go to Community tab to contribute new words!')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Translation error:', error);
      Alert.alert('Error', 'Failed to translate. Please check your connection.');
    } finally {
      setIsTranslating(false);
    }
  };

  const selectSuggestion = (word: TranslationResult) => {
    setInputText(word[fromLang]);
    setTranslatedText(word[toLang]);
    setSuggestions([]);
  };

  const clearAll = () => {
    setInputText('');
    setTranslatedText('');
    setSuggestions([]);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="language" size={width * 0.15} color="#8B4513" />
          <ThemedText style={styles.title}>Translate</ThemedText>
          <ThemedText style={styles.subtitle}>
            Trilingual translation for Inete language
          </ThemedText>
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

        <View style={styles.languageSelector}>
          <View style={styles.languageBox}>
            <ThemedText style={styles.languageBoxLabel}>From</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={`from-${lang.key}`}
                  style={[
                    styles.languageButton,
                    fromLang === lang.key && styles.languageButtonActive,
                    lang.key === toLang && styles.languageButtonDisabled,
                  ]}
                  onPress={() => setFromLang(lang.key)}
                  disabled={lang.key === toLang}>
                  <ThemedText style={styles.languageIcon}>{lang.icon}</ThemedText>
                  <ThemedText
                    style={[
                      styles.languageButtonText,
                      fromLang === lang.key && styles.languageButtonTextActive,
                    ]}>
                    {lang.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
            <Ionicons name="swap-horizontal" size={28} color="#8B4513" />
          </TouchableOpacity>

          <View style={styles.languageBox}>
            <ThemedText style={styles.languageBoxLabel}>To</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={`to-${lang.key}`}
                  style={[
                    styles.languageButton,
                    toLang === lang.key && styles.languageButtonActive,
                    lang.key === fromLang && styles.languageButtonDisabled,
                  ]}
                  onPress={() => setToLang(lang.key)}
                  disabled={lang.key === fromLang}>
                  <ThemedText style={styles.languageIcon}>{lang.icon}</ThemedText>
                  <ThemedText
                    style={[
                      styles.languageButtonText,
                      toLang === lang.key && styles.languageButtonTextActive,
                    ]}>
                    {lang.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.translationCard}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardLabel}>
              {languages.find((l) => l.key === fromLang)?.label}
            </ThemedText>
            {inputText.length > 0 && (
              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.speakerButton}
                  onPress={() => speak(inputText, fromLang)}>
                  <Ionicons 
                    name={isSpeaking ? "volume-high" : "volume-medium-outline"} 
                    size={20} 
                    color="#8B4513" 
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setInputText('')}>
                  <Ionicons name="close-circle" size={20} color="#8B4513" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={`Enter text in ${languages.find((l) => l.key === fromLang)?.label}`}
            placeholderTextColor="#A0826D"
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.translateButton, isTranslating && styles.translateButtonDisabled]}
          onPress={translate}
          disabled={isTranslating}>
          {isTranslating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="swap-vertical" size={20} color="#fff" />
              <ThemedText style={styles.translateButtonText}>Translate</ThemedText>
            </>
          )}
        </TouchableOpacity>

        {translatedText || suggestions.length > 0 ? (
          <View style={styles.translationCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardLabel}>
                {languages.find((l) => l.key === toLang)?.label}
              </ThemedText>
              {translatedText && (
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.speakerButton}
                    onPress={() => speak(translatedText, toLang)}>
                    <Ionicons 
                      name={isSpeaking ? "volume-high" : "volume-medium-outline"} 
                      size={20} 
                      color="#8B4513" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={clearAll}>
                    <Ionicons name="refresh" size={20} color="#8B4513" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            {translatedText ? (
              <View style={styles.resultBox}>
                <ThemedText style={styles.resultText}>{translatedText}</ThemedText>
              </View>
            ) : null}

            {suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <ThemedText style={styles.suggestionsTitle}>
                  Did you mean:
                </ThemedText>
                {suggestions.map((word) => (
                  <TouchableOpacity
                    key={word._id}
                    style={styles.suggestionCard}
                    onPress={() => selectSuggestion(word)}>
                    <View style={styles.suggestionRow}>
                      <ThemedText style={styles.suggestionFrom}>
                        {word[fromLang]}
                      </ThemedText>
                      <Ionicons name="arrow-forward" size={16} color="#8B4513" />
                      <ThemedText style={styles.suggestionTo}>
                        {word[toLang]}
                      </ThemedText>
                    </View>
                    {word[`definition${toLang.charAt(0).toUpperCase() + toLang.slice(1)}` as keyof TranslationResult] && (
                      <ThemedText style={styles.suggestionDef} numberOfLines={2}>
                        {word[`definition${toLang.charAt(0).toUpperCase() + toLang.slice(1)}` as keyof TranslationResult] as string}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : null}

        <View style={styles.infoSection}>
          <Ionicons name="information-circle-outline" size={24} color="#8B4513" />
          <ThemedText style={styles.infoText}>
            {useOfflineMode 
              ? 'Using offline dictionary. Download updates to get the latest words or switch to online mode.'
              : 'Translation is powered by our community dictionary. Can\'t find a word? Contribute it in the Community tab!'
            }
          </ThemedText>
        </View>

        <View style={{ height: height * 0.05 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF0',
  },
  header: {
    alignItems: 'center',
    padding: width * 0.08,
    backgroundColor: '#F5F5DC',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginTop: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.035,
    color: '#8B4513',
    textAlign: 'center',
    marginTop: height * 0.01,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8DC',
    marginHorizontal: width * 0.04,
    marginTop: height * 0.02,
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
  languageSelector: {
    padding: width * 0.04,
    gap: 12,
  },
  languageBox: {
    gap: 8,
  },
  languageBoxLabel: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 4,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.04,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D2B48C',
    marginRight: 8,
    gap: 6,
  },
  languageButtonActive: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  languageButtonDisabled: {
    opacity: 0.3,
  },
  languageIcon: {
    fontSize: width * 0.045,
  },
  languageButtonText: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#5D4E37',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#FFF8DC',
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.065,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  translationCard: {
    backgroundColor: '#FFF8DC',
    margin: width * 0.04,
    marginTop: height * 0.01,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    padding: width * 0.04,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  cardLabel: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  speakerButton: {
    padding: 4,
  },
  textInput: {
    fontSize: width * 0.045,
    color: '#5D4E37',
    minHeight: height * 0.12,
    textAlignVertical: 'top',
  },
  translateButton: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.04,
    padding: height * 0.02,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  translateButtonDisabled: {
    opacity: 0.6,
  },
  translateButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: '#F5F5DC',
    padding: width * 0.04,
    borderRadius: 8,
    minHeight: height * 0.12,
  },
  resultText: {
    fontSize: width * 0.05,
    color: '#5D4E37',
    fontWeight: '600',
    lineHeight: height * 0.035,
  },
  suggestionsContainer: {
    marginTop: height * 0.02,
  },
  suggestionsTitle: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: height * 0.01,
  },
  suggestionCard: {
    backgroundColor: '#F5F5DC',
    padding: width * 0.03,
    borderRadius: 8,
    marginBottom: height * 0.01,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  suggestionFrom: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#5D4E37',
  },
  suggestionTo: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#8B4513',
  },
  suggestionDef: {
    fontSize: width * 0.033,
    color: '#5D4E37',
    marginTop: 4,
    fontStyle: 'italic',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    margin: width * 0.04,
    padding: width * 0.04,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: width * 0.033,
    color: '#5D4E37',
    lineHeight: 20,
  },
});
