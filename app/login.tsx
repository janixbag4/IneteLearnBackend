import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useRouter } from 'expo-router';

import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { API_URL } from '../inetelearn-backend/config/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  // In login.tsx - Update the handleLogin function
const handleLogin = async () => {
  // Validation
  if (!email || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  if (!email.includes('@')) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password: password,
      }),
    });
    
    const data = await response.json();

    if (response.ok) {
      // ✅ STORE USER DATA IN ASYNCSTORAGE
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userId', data.userId);
      await AsyncStorage.setItem('userFullName', data.fullName);
      await AsyncStorage.setItem('userEmail', data.email);
      
      Alert.alert('Success', 'Login successful!');
      router.replace('/(tabs)' as Href);
    } else {
      Alert.alert('Error', data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    Alert.alert('Error', 'An error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};



  const navigateToSignup = () => {
    router.push('/signup' as Href);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Ionicons name="book" size={80} color="#8B4513" />
          <ThemedText style={styles.title}>IneteLearn</ThemedText>
          <ThemedText style={styles.subtitle}>Welcome Back</ThemedText>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#8B4513" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#A0826D"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#8B4513" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#A0826D"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}>
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#8B4513" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}>
            <ThemedText style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </ThemedText>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>or</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          {/* Social login removed per request */}

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <ThemedText style={styles.signupText}>Don't have an account? </ThemedText>
            <TouchableOpacity onPress={navigateToSignup}>
              <ThemedText style={styles.signupLink}>Sign Up</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF0',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 16,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0826D',
    marginTop: 8,
    fontStyle: 'italic',
  },
  formSection: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4E37',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#5D4E37',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#8B4513',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D2B48C',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#A0826D',
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF8DC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#5D4E37',
    fontSize: 14,
  },
  signupLink: {
    color: '#8B4513',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
