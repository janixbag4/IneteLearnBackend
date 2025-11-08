// app/community.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { API_URL } from '../inetelearn-backend/config/api'; // ← FIXED import path

export default function CommunityScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    inete: '',
    hiligaynon: '',
    english: '',
    definitionInete: '',
    definitionHiligaynon: '',
    definitionEnglish: '',
    exampleInete: '',
    exampleHiligaynon: '',
    exampleEnglish: '',
    contributorName: '',
    contributorEmail: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      inete: '',
      hiligaynon: '',
      english: '',
      definitionInete: '',
      definitionHiligaynon: '',
      definitionEnglish: '',
      exampleInete: '',
      exampleHiligaynon: '',
      exampleEnglish: '',
      contributorName: '',
      contributorEmail: '',
    });
  };

  const validateForm = () => {
    if (!formData.inete.trim()) {
      Alert.alert('Error', 'Inete word is required');
      return false;
    }
    if (!formData.hiligaynon.trim()) {
      Alert.alert('Error', 'Hiligaynon translation is required');
      return false;
    }
    if (!formData.english.trim()) {
      Alert.alert('Error', 'English translation is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('Submitting contribution to:', `${API_URL}/api/dictionary/contribute`);
      
      const response = await fetch(`${API_URL}/api/dictionary/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success! 🎉',
          'Thank you for contributing to the Inete dictionary! Your word is now available.',
          [
            {
              text: 'Add Another',
              onPress: () => resetForm(),
            },
            {
              text: 'Close',
              onPress: () => {
                resetForm();
                setModalVisible(false);
              },
            }
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to add word');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Cannot connect to server. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="people" size={60} color="#8B4513" />
        <ThemedText style={styles.title}>Community</ThemedText>
        <ThemedText style={styles.subtitle}>
          Help preserve the Inete language by contributing words
        </ThemedText>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Contribute Button */}
        <TouchableOpacity
          style={styles.contributeButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <ThemedText style={styles.contributeButtonText}>
            Contribute a Word
          </ThemedText>
        </TouchableOpacity>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <Ionicons name="heart" size={32} color="#8B4513" />
          <ThemedText style={styles.infoTitle}>Join Our Mission</ThemedText>
          <ThemedText style={styles.infoText}>
            Every word you contribute helps preserve the Inete language for future generations
          </ThemedText>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="globe" size={32} color="#8B4513" />
          <ThemedText style={styles.infoTitle}>Build Together</ThemedText>
          <ThemedText style={styles.infoText}>
            Your contributions will be available in both Dictionary and Translate features
          </ThemedText>
        </View>
      </View>

      {/* Contribution Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add New Word</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Form */}
            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              {/* Required Fields */}
              <ThemedText style={styles.sectionTitle}>Required Fields *</ThemedText>
              
              <ThemedText style={styles.label}>Inete Word *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter word in Inete"
                placeholderTextColor="#A0826D"
                value={formData.inete}
                onChangeText={(text) => updateField('inete', text)}
              />

              <ThemedText style={styles.label}>Hiligaynon Translation *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter Hiligaynon translation"
                placeholderTextColor="#A0826D"
                value={formData.hiligaynon}
                onChangeText={(text) => updateField('hiligaynon', text)}
              />

              <ThemedText style={styles.label}>English Translation *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter English translation"
                placeholderTextColor="#A0826D"
                value={formData.english}
                onChangeText={(text) => updateField('english', text)}
              />

              {/* Optional Fields */}
              <ThemedText style={[styles.sectionTitle, styles.optionalSection]}>
                Optional Details
              </ThemedText>

              <ThemedText style={styles.label}>Definition in Inete</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Explain the meaning in Inete"
                placeholderTextColor="#A0826D"
                value={formData.definitionInete}
                onChangeText={(text) => updateField('definitionInete', text)}
                multiline
                numberOfLines={3}
              />

              <ThemedText style={styles.label}>Definition in Hiligaynon</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Explain the meaning in Hiligaynon"
                placeholderTextColor="#A0826D"
                value={formData.definitionHiligaynon}
                onChangeText={(text) => updateField('definitionHiligaynon', text)}
                multiline
                numberOfLines={3}
              />

              <ThemedText style={styles.label}>Definition in English</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Explain the meaning in English"
                placeholderTextColor="#A0826D"
                value={formData.definitionEnglish}
                onChangeText={(text) => updateField('definitionEnglish', text)}
                multiline
                numberOfLines={3}
              />

              <ThemedText style={styles.label}>Example Sentence in Inete</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Provide example usage in Inete"
                placeholderTextColor="#A0826D"
                value={formData.exampleInete}
                onChangeText={(text) => updateField('exampleInete', text)}
                multiline
                numberOfLines={2}
              />

              <ThemedText style={styles.label}>Example Sentence in Hiligaynon</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Provide example usage in Hiligaynon"
                placeholderTextColor="#A0826D"
                value={formData.exampleHiligaynon}
                onChangeText={(text) => updateField('exampleHiligaynon', text)}
                multiline
                numberOfLines={2}
              />

              <ThemedText style={styles.label}>Example Sentence in English</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Provide example usage in English"
                placeholderTextColor="#A0826D"
                value={formData.exampleEnglish}
                onChangeText={(text) => updateField('exampleEnglish', text)}
                multiline
                numberOfLines={2}
              />

              {/* Contributor Info */}
              <ThemedText style={[styles.sectionTitle, styles.optionalSection]}>
                Your Information (Optional)
              </ThemedText>

              <ThemedText style={styles.label}>Your Name</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter your name (optional)"
                placeholderTextColor="#A0826D"
                value={formData.contributorName}
                onChangeText={(text) => updateField('contributorName', text)}
              />

              <ThemedText style={styles.label}>Your Email</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter your email (optional)"
                placeholderTextColor="#A0826D"
                value={formData.contributorEmail}
                onChangeText={(text) => updateField('contributorEmail', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}>
                <ThemedText style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
                </ThemedText>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    padding: 32,
    backgroundColor: '#F5F5DC',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  contributeButton: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  contributeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#FFF8DC',
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#5D4E37',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    backgroundColor: '#FFFEF0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5DC',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4E37',
  },
  divider: {
    height: 2,
    backgroundColor: '#D2B48C',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
    marginTop: 8,
  },
  optionalSection: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4E37',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFF8DC',
    borderWidth: 2,
    borderColor: '#D2B48C',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#5D4E37',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
