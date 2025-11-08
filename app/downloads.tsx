// app/downloads.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { API_URL } from '../inetelearn-backend/config/api'; // ← FIXED import path

interface OfflineData {
  words: any[];
  downloadDate: string;
  wordCount: number;
}

export default function DownloadsScreen() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [storageSize, setStorageSize] = useState<string>('0 KB');

  useEffect(() => {
    checkOfflineData();
  }, []);

  const checkOfflineData = async () => {
    try {
      const data = await AsyncStorage.getItem('offlineDictionary');
      if (data) {
        const parsed: OfflineData = JSON.parse(data);
        setOfflineData(parsed);
        
        // Calculate storage size
        const sizeInBytes = new Blob([data]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        setStorageSize(`${sizeInKB} KB`);
      }
    } catch (error) {
      console.error('Error checking offline data:', error);
    }
  };

  const downloadDictionary = async () => {
    setIsDownloading(true);
    try {
      // Fetch all words from dictionary
      const response = await fetch(`${API_URL}/api/dictionary?limit=10000`);
      const words = await response.json();

      if (words.length === 0) {
        Alert.alert('No Data', 'Dictionary is empty. Add some words first!');
        setIsDownloading(false);
        return;
      }

      // Save to AsyncStorage
      const offlineData: OfflineData = {
        words,
        downloadDate: new Date().toISOString(),
        wordCount: words.length,
      };

      await AsyncStorage.setItem('offlineDictionary', JSON.stringify(offlineData));

      setOfflineData(offlineData);
      
      // Calculate size
      const sizeInBytes = new Blob([JSON.stringify(offlineData)]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      setStorageSize(`${sizeInKB} KB`);

      Alert.alert(
        'Success!',
        `Downloaded ${words.length} words for offline use.`,
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download dictionary. Please check your connection.');
    } finally {
      setIsDownloading(false);
    }
  };

  const deleteOfflineData = () => {
    Alert.alert(
      'Delete Offline Data',
      'Are you sure you want to delete the offline dictionary?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('offlineDictionary');
              setOfflineData(null);
              setStorageSize('0 KB');
              Alert.alert('Deleted', 'Offline dictionary removed.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete offline data.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="download" size={80} color="#8B4513" />
          <ThemedText style={styles.title}>Downloads</ThemedText>
          <ThemedText style={styles.subtitle}>
            Access dictionary and translate offline
          </ThemedText>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          {offlineData ? (
            <>
              <View style={styles.statusHeader}>
                <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                <ThemedText style={styles.statusTitle}>Offline Mode Ready</ThemedText>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Ionicons name="book" size={32} color="#8B4513" />
                  <ThemedText style={styles.statNumber}>{offlineData.wordCount}</ThemedText>
                  <ThemedText style={styles.statLabel}>Words</ThemedText>
                </View>

                <View style={styles.statBox}>
                  <Ionicons name="save" size={32} color="#8B4513" />
                  <ThemedText style={styles.statNumber}>{storageSize}</ThemedText>
                  <ThemedText style={styles.statLabel}>Storage</ThemedText>
                </View>

                <View style={styles.statBox}>
                  <Ionicons name="time" size={32} color="#8B4513" />
                  <ThemedText style={styles.statDate}>
                    {formatDate(offlineData.downloadDate)}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Last Updated</ThemedText>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.updateButton, isDownloading && styles.buttonDisabled]}
                  onPress={downloadDictionary}
                  disabled={isDownloading}>
                  {isDownloading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="refresh" size={20} color="#fff" />
                      <ThemedText style={styles.updateButtonText}>Update</ThemedText>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={deleteOfflineData}>
                  <Ionicons name="trash" size={20} color="#F44336" />
                  <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statusHeader}>
                <Ionicons name="cloud-offline" size={48} color="#A0826D" />
                <ThemedText style={styles.statusTitle}>No Offline Data</ThemedText>
              </View>

              <ThemedText style={styles.emptyText}>
                Download the dictionary to use IneteLearn without internet connection
              </ThemedText>

              <TouchableOpacity
                style={[styles.downloadButton, isDownloading && styles.buttonDisabled]}
                onPress={downloadDictionary}
                disabled={isDownloading}>
                {isDownloading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="download" size={24} color="#fff" />
                    <ThemedText style={styles.downloadButtonText}>
                      Download Dictionary
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <ThemedText style={styles.sectionTitle}>Offline Features</ThemedText>

          <View style={styles.featureCard}>
            <Ionicons name="book-outline" size={32} color="#8B4513" />
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Dictionary Search</ThemedText>
              <ThemedText style={styles.featureDesc}>
                Search and browse all words without internet
              </ThemedText>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="language-outline" size={32} color="#8B4513" />
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Offline Translation</ThemedText>
              <ThemedText style={styles.featureDesc}>
                Translate between Inete, Hiligaynon, and English
              </ThemedText>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="sync-outline" size={32} color="#8B4513" />
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Auto-Sync</ThemedText>
              <ThemedText style={styles.featureDesc}>
                Update anytime to get the latest words
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#8B4513" />
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoText}>
              Note: Quiz and Community features require internet connection. Downloaded data is stored on your device.
            </ThemedText>
          </View>
        </View>
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
  statusCard: {
    backgroundColor: '#FFF8DC',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 8,
  },
  statDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B4513',
    marginTop: 8,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#A0826D',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F44336',
    gap: 8,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 15,
    color: '#5D4E37',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  downloadButton: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  featuresSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8DC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    marginBottom: 12,
    gap: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#5D4E37',
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8DC',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: '#5D4E37',
    lineHeight: 20,
  },
});
