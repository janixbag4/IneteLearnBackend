// app/explore.tsx - CLEANED UP VERSION
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface OptionType {
  id: number;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  route: string;
}

export default function ExploreScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const options: OptionType[] = [
    { 
      id: 1, 
      title: 'Dictionary', 
      icon: 'book-outline', 
      description: 'Search and explore word definitions, pronunciations, and usage examples in Inete, Hiligaynon, and English.',
      route: '/dictionary'
    },
    { 
      id: 2, 
      title: 'Translate', 
      icon: 'language-outline', 
      description: 'Translate words and phrases between Inete, Hiligaynon, and English instantly with text-to-speech support.',
      route: '/translate'
    },
    { 
      id: 3, 
      title: 'Quiz', 
      icon: 'school-outline', 
      description: 'Test your knowledge of the Inete language with interactive quizzes and track your progress.',
      route: '/quiz'
    },
    { 
      id: 4, 
      title: 'Community', 
      icon: 'people-outline', 
      description: 'Contribute new words to the dictionary and help preserve the Inete language for future generations.',
      route: '/community'
    },
    { 
      id: 5, 
      title: 'Downloads', 
      icon: 'download-outline', 
      description: 'Download the dictionary for offline use and access translations without internet connection.',
      route: '/downloads'
    },
    { 
      id: 6, 
      title: 'Profile', 
      icon: 'person-outline', 
      description: 'Manage your account settings, preferences, and view your learning statistics.',
      route: '/profile'
    },
  ];

  const handleButtonPress = (option: OptionType) => {
    setSelectedOption(option);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOption(null);
  };

  const navigateToPage = () => {
    if (selectedOption) {
      closeModal();
      router.push(selectedOption.route as Href);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F5F5DC', dark: '#2C2416' }}
      headerImage={
        <View style={styles.dictionaryHeader}>
          <Ionicons name="compass" size={width * 0.2} color="#8B4513" style={styles.bookIcon} />
          <ThemedText style={styles.dictionaryTitle}>Explore</ThemedText>
          <ThemedText style={styles.dictionarySubtitle}>Discover IneteLearn Features</ThemedText>
        </View>
      }>
      
      <ThemedView style={styles.introSection}>
        <ThemedText style={styles.introText}>
          Choose a feature below to start your learning journey
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.gridContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionButton}
            onPress={() => handleButtonPress(option)}
            activeOpacity={0.7}>
            <View style={styles.buttonContent}>
              <Ionicons name={option.icon} size={width * 0.08} color="#8B4513" />
              <ThemedText style={styles.buttonText}>{option.title}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Modal Component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                {selectedOption && (
                  <Ionicons name={selectedOption.icon} size={28} color="#8B4513" />
                )}
              </View>
              <ThemedText style={styles.modalTitle}>
                {selectedOption?.title}
              </ThemedText>
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#666" />
              </Pressable>
            </View>

            <View style={styles.divider} />

            <ScrollView style={styles.modalBody}>
              <View style={styles.pronunciationSection}>
                <ThemedText style={styles.wordClass}>feature</ThemedText>
                <ThemedText style={styles.pronunciation}>
                  /{selectedOption?.title.toLowerCase()}/
                </ThemedText>
              </View>

              <View style={styles.definitionSection}>
                <ThemedText style={styles.definitionNumber}>1.</ThemedText>
                <ThemedText style={styles.definitionText}>
                  {selectedOption?.description}
                </ThemedText>
              </View>

              <View style={styles.exampleSection}>
                <ThemedText style={styles.exampleLabel}>Example:</ThemedText>
                <ThemedText style={styles.exampleText}>
                  "Access the {selectedOption?.title.toLowerCase()} to enhance your learning experience."
                </ThemedText>
              </View>

              <TouchableOpacity 
                style={styles.navigateButton}
                onPress={navigateToPage}>
                <ThemedText style={styles.navigateButtonText}>
                  Go to {selectedOption?.title}
                </ThemedText>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  dictionaryHeader: {
    height: height * 0.25,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.05,
  },
  bookIcon: {
    marginBottom: height * 0.012,
  },
  dictionaryTitle: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  dictionarySubtitle: {
    fontSize: width * 0.04,
    color: '#A0826D',
    fontStyle: 'italic',
    marginTop: height * 0.005,
  },
  introSection: {
    marginBottom: height * 0.02,
  },
  introText: {
    fontSize: width * 0.04,
    textAlign: 'center',
    color: '#8B4513',
    fontStyle: 'italic',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: width * 0.03,
    paddingVertical: height * 0.01,
  },
  optionButton: {
    width: '48%',
    aspectRatio: 1.2,
    backgroundColor: '#FFF8DC',
    borderRadius: 12,
    padding: width * 0.04,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: height * 0.015,
  },
  buttonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    textAlign: 'center',
    color: '#5D4E37',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#FFFEF0',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: width * 0.05,
    backgroundColor: '#F5F5DC',
  },
  headerLeft: {
    width: 28,
  },
  modalTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#5D4E37',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  divider: {
    height: 2,
    backgroundColor: '#D2B48C',
  },
  modalBody: {
    padding: width * 0.05,
  },
  pronunciationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: height * 0.025,
  },
  wordClass: {
    fontSize: width * 0.035,
    fontStyle: 'italic',
    color: '#8B4513',
  },
  pronunciation: {
    fontSize: width * 0.04,
    color: '#8B4513',
    fontStyle: 'italic',
  },
  definitionSection: {
    flexDirection: 'row',
    marginBottom: height * 0.025,
    gap: 8,
  },
  definitionNumber: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#5D4E37',
  },
  definitionText: {
    fontSize: width * 0.04,
    color: '#5D4E37',
    flex: 1,
    lineHeight: height * 0.03,
  },
  exampleSection: {
    marginBottom: height * 0.03,
    paddingLeft: width * 0.05,
    borderLeftWidth: 3,
    borderLeftColor: '#8B4513',
  },
  exampleLabel: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: height * 0.01,
  },
  exampleText: {
    fontSize: width * 0.038,
    color: '#5D4E37',
    fontStyle: 'italic',
    lineHeight: height * 0.028,
  },
  navigateButton: {
    backgroundColor: '#8B4513',
    padding: height * 0.02,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: height * 0.025,
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});
