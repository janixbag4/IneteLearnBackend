// app/welcome.tsx - FIXED TITLE FONT
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const navigateToLogin = () => {
    router.push('/login' as Href);
  };

  const navigateToSignup = () => {
    router.push('/signup' as Href);
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.gradientBackground}>
        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />
      </View>

      {/* Content Container */}
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
        
        {/* Logo and Title Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="book" size={width * 0.25} color="#8B4513" />
          </View>
          
          {/* Fixed Title - Using Text instead of ThemedText */}
          <Text style={styles.title}>IneteLearn</Text>
          
          <ThemedText style={styles.tagline}>
            Preserve. Learn. Connect.
          </ThemedText>
          <ThemedText style={styles.description}>
            Your gateway to learning the Inete language and connecting with a vibrant community of learners.
          </ThemedText>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="book-outline" size={width * 0.06} color="#8B4513" />
            <ThemedText style={styles.featureText}>Dictionary</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="language-outline" size={width * 0.06} color="#8B4513" />
            <ThemedText style={styles.featureText}>Translate</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="school-outline" size={width * 0.06} color="#8B4513" />
            <ThemedText style={styles.featureText}>Quiz</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people-outline" size={width * 0.06} color="#8B4513" />
            <ThemedText style={styles.featureText}>Community</ThemedText>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          {/* Sign Up Button (Primary) */}
          <TouchableOpacity 
            style={styles.signupButton}
            onPress={navigateToSignup}
            activeOpacity={0.8}>
            <ThemedText style={styles.signupButtonText}>Get Started</ThemedText>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>

          {/* Login Button (Secondary) */}
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={navigateToLogin}
            activeOpacity={0.8}>
            <ThemedText style={styles.loginButtonText}>I Already Have an Account</ThemedText>
          </TouchableOpacity>

          {/* Guest/Skip Option */}
          <TouchableOpacity 
            style={styles.guestButton}
            onPress={() => router.push('/(tabs)' as Href)}
            activeOpacity={0.7}>
            <ThemedText style={styles.guestButtonText}>Continue as Guest</ThemedText>
            <Ionicons name="arrow-forward-outline" size={16} color="#A0826D" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#A0826D" />
          <ThemedText style={styles.footerText}>
            A project by ISUFST Dumangas
          </ThemedText>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF0',
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circleTop: {
    position: 'absolute',
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: '#FFF8DC',
    top: -width * 0.25,
    right: -width * 0.25,
    opacity: 0.5,
  },
  circleBottom: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width * 0.5,
    backgroundColor: '#F5F5DC',
    bottom: -width * 0.375,
    left: -width * 0.375,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.08,
    paddingBottom: height * 0.05,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: height * 0.025,
  },
  logoContainer: {
    width: width * 0.35,
    height: width * 0.35,
    backgroundColor: '#FFF8DC',
    borderRadius: width * 0.175,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.025,
    borderWidth: 3,
    borderColor: '#D2B48C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: width * 0.105,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: height * 0.01,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: width * 0.045,
    color: '#A0826D',
    fontStyle: 'italic',
    marginBottom: height * 0.02,
  },
  description: {
    fontSize: width * 0.038,
    color: '#5D4E37',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: width * 0.05,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: width * 0.025,
    marginVertical: height * 0.025,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: width * 0.03,
    color: '#8B4513',
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: height * 0.02,
    marginTop: height * 0.025,
  },
  signupButton: {
    backgroundColor: '#8B4513',
    borderRadius: 16,
    padding: height * 0.022,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: height * 0.022,
    borderWidth: 2,
    borderColor: '#8B4513',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#8B4513',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: height * 0.015,
    gap: 6,
  },
  guestButtonText: {
    color: '#A0826D',
    fontSize: width * 0.038,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: height * 0.025,
  },
  footerText: {
    fontSize: width * 0.033,
    color: '#A0826D',
    fontStyle: 'italic',
  },
});
