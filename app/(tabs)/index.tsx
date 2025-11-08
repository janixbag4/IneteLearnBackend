import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F5F5DC', dark: '#2C2416' }}
      headerImage={
        <View style={styles.headerContainer}>
          <Ionicons name="book" size={80} color="#8B4513" style={styles.bookIcon} />
          <ThemedText style={styles.appTitle}>IneteLearn</ThemedText>
          <ThemedText style={styles.tagline}>Learn Inete. Anytime, Anywhere.</ThemedText>
        </View>
      }>
      
      {/* Welcome Section */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="home" size={24} color="#8B4513" />
          <ThemedText style={styles.sectionTitle}>Welcome to IneteLearn</ThemedText>
        </View>
        <ThemedText style={styles.bodyText}>
          IneteLearn is a comprehensive digital platform designed to preserve, promote, and teach the Inete language—a vital part of our cultural heritage.
        </ThemedText>
      </ThemedView>

      {/* Vision Section */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="eye" size={24} color="#8B4513" />
          <ThemedText style={styles.sectionTitle}>Our Vision</ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText style={styles.cardText}>
            To become the leading platform for preserving and revitalizing the Inete language, empowering communities to maintain their linguistic heritage while making the language accessible to learners worldwide through innovative technology and education.
          </ThemedText>
        </View>
      </ThemedView>

      {/* Mission Section */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="compass" size={24} color="#8B4513" />
          <ThemedText style={styles.sectionTitle}>Our Mission</ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText style={styles.cardText}>
            To provide a comprehensive, user-friendly digital platform that enables anyone to learn, practice, and master the Inete language through:
          </ThemedText>
          <View style={styles.missionPoints}>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#8B4513" />
              <ThemedText style={styles.bulletText}>
                Interactive dictionary and translation tools
              </ThemedText>
            </View>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#8B4513" />
              <ThemedText style={styles.bulletText}>
                Engaging educational quizzes and exercises
              </ThemedText>
            </View>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#8B4513" />
              <ThemedText style={styles.bulletText}>
                Community-driven learning experiences
              </ThemedText>
            </View>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#8B4513" />
              <ThemedText style={styles.bulletText}>
                Offline access for learning anywhere
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>

      {/* About Project Section */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="school" size={24} color="#8B4513" />
          <ThemedText style={styles.sectionTitle}>About This Project</ThemedText>
        </View>
        <View style={styles.aboutCard}>
          <ThemedText style={styles.aboutText}>
            IneteLearn is a capstone project developed by IT students from the Iloilo State University of Fisheries Science and Technology (ISUFST) - Dumangas Campus, Iloilo.
          </ThemedText>
          <ThemedText style={styles.aboutText}>
            This project represents our commitment to leveraging technology for cultural preservation and education, combining modern mobile development with the rich linguistic heritage of our region.
          </ThemedText>
          <View style={styles.universityBadge}>
            <Ionicons name="ribbon" size={20} color="#8B4513" />
            <ThemedText style={styles.badgeText}>ISUFST Dumangas</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Features Overview */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="grid" size={24} color="#8B4513" />
          <ThemedText style={styles.sectionTitle}>What We Offer</ThemedText>
        </View>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Ionicons name="book-outline" size={32} color="#8B4513" />
            <ThemedText style={styles.featureTitle}>Dictionary</ThemedText>
            <ThemedText style={styles.featureDesc}>Comprehensive word database</ThemedText>
          </View>
          <View style={styles.featureCard}>
            <Ionicons name="language-outline" size={32} color="#8B4513" />
            <ThemedText style={styles.featureTitle}>Translate</ThemedText>
            <ThemedText style={styles.featureDesc}>Instant translations</ThemedText>
          </View>
          <View style={styles.featureCard}>
            <Ionicons name="school-outline" size={32} color="#8B4513" />
            <ThemedText style={styles.featureTitle}>Quiz</ThemedText>
            <ThemedText style={styles.featureDesc}>Test your knowledge</ThemedText>
          </View>
          <View style={styles.featureCard}>
            <Ionicons name="people-outline" size={32} color="#8B4513" />
            <ThemedText style={styles.featureTitle}>Community</ThemedText>
            <ThemedText style={styles.featureDesc}>Connect with learners</ThemedText>
          </View>
        </View>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  bookIcon: {
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8B4513',
    fontFamily: 'serif',
  },
  tagline: {
    fontSize: 16,
    color: '#A0826D',
    fontStyle: 'italic',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D4E37',
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5D4E37',
  },
  card: {
    backgroundColor: '#FFF8DC',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5D4E37',
  },
  missionPoints: {
    marginTop: 16,
    gap: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#5D4E37',
  },
  aboutCard: {
    backgroundColor: '#FFFEF0',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    gap: 12,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5D4E37',
  },
  universityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F5F5DC',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFF8DC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    alignItems: 'center',
    gap: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4E37',
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 13,
    color: '#8B4513',
    textAlign: 'center',
  },
});
