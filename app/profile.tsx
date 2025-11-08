// app/profile.tsx - FIXED HOOKS ORDER
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { API_URL } from '../inetelearn-backend/config/api'; // ← FIXED import path

const { width, height } = Dimensions.get('window');

interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  token: string;
}

type InfoModalType = 'about' | 'terms' | 'help' | null;

export default function ProfileScreen() {
  const router = useRouter();
  
  // ✅ ALL HOOKS MUST BE AT THE TOP - BEFORE ANY RETURNS
  const [isGuest, setIsGuest] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState<InfoModalType>(null);
  const [editedName, setEditedName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ ALL useEffect MUST BE BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    checkUserStatus();
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkUserStatus();
    }, [])
  );

  const checkUserStatus = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      const fullName = await AsyncStorage.getItem('userFullName');
      const email = await AsyncStorage.getItem('userEmail');

      if (token && userId && fullName && email) {
        setIsGuest(false);
        setUserProfile({ userId, fullName, email, token });
        setEditedName(fullName);
      } else {
        setIsGuest(true);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setIsGuest(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'userToken',
                'userId',
                'userFullName',
                'userEmail',
              ]);
              setIsGuest(true);
              setUserProfile(null);
              // Navigate user back to the welcome screen after logout
            Alert.alert('Logged Out', 'You have been logged out successfully.');
              router.replace('/welcome' as Href);
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleUpdateProfile = async () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      setIsUpdating(true);

      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userProfile?.userId,
          fullName: editedName.trim(),
          token: userProfile?.token,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userFullName', editedName.trim());
        setUserProfile({ ...userProfile!, fullName: editedName.trim() });
        setEditModalVisible(false);
        Alert.alert('Success', 'Profile updated in database!');
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please check your connection.');
    } finally {
      setIsUpdating(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/login' as Href);
  };

  const navigateToSignup = () => {
    router.push('/signup' as Href);
  };

  const getInfoModalContent = () => {
    switch (infoModalVisible) {
      case 'about':
        return {
          title: 'About IneteLearn',
          icon: 'information-circle' as keyof typeof Ionicons.glyphMap,
          content: [
            {
              label: 'Mission',
              text: 'IneteLearn is dedicated to preserving and promoting the Inete language through modern technology and community collaboration.'
            },
            {
              label: 'Features',
              text: 'Our app provides a comprehensive trilingual dictionary, translation tools, interactive quizzes, and a platform for community contributions.'
            },
            {
              label: 'Developed by',
              text: 'This application is a capstone project developed by students of Iloilo State University of Fisheries Science and Technology (ISUFST) - Dumangas Campus.'
            }
          ]
        };
      case 'terms':
        return {
          title: 'Terms & Privacy',
          icon: 'document-text' as keyof typeof Ionicons.glyphMap,
          content: [
            {
              label: 'Usage Terms',
              text: 'By using IneteLearn, you agree to contribute positively to the preservation of the Inete language and respect the intellectual property of all contributors.'
            },
            {
              label: 'Privacy Policy',
              text: 'We collect minimal user information (name and email) solely for account management. Your data is stored securely and will never be shared with third parties.'
            },
            {
              label: 'Content Rights',
              text: 'All user-contributed content becomes part of the IneteLearn community database to help preserve the Inete language for future generations.'
            }
          ]
        };
      case 'help':
        return {
          title: 'Help & Support',
          icon: 'help-circle' as keyof typeof Ionicons.glyphMap,
          content: [
            {
              label: 'Getting Started',
              text: 'Browse the dictionary, use the translation feature, or take quizzes to test your knowledge. Create an account to contribute new words.'
            },
            {
              label: 'Offline Mode',
              text: 'Download the dictionary from the Downloads page to access all features without internet connection.'
            },
            {
              label: 'Contact Us',
              text: 'For questions or support, please contact the ISUFST Dumangas Campus. We welcome feedback and suggestions to improve IneteLearn.'
            }
          ]
        };
      default:
        return null;
    }
  };

  // ✅ NOW IT'S SAFE TO RETURN JSX AFTER ALL HOOKS
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (isGuest) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.guestContainer}>
          <View style={styles.guestHeader}>
            <View style={styles.guestAvatarContainer}>
              <Ionicons name="person-circle-outline" size={width * 0.3} color="#D2B48C" />
              <View style={styles.guestBadge}>
                <ThemedText style={styles.guestBadgeText}>GUEST</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.guestTitle}>Guest Mode</ThemedText>
            <ThemedText style={styles.guestSubtitle}>
              You're browsing as a guest
            </ThemedText>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={32} color="#8B4513" />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoTitle}>Limited Access</ThemedText>
              <ThemedText style={styles.infoText}>
                As a guest, you can browse the dictionary and translate, but cannot contribute words.
              </ThemedText>
            </View>
          </View>

          <View style={styles.benefitsSection}>
            <ThemedText style={styles.sectionTitle}>Create an Account to:</ThemedText>

            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <ThemedText style={styles.benefitText}>
                Contribute new words to the dictionary
              </ThemedText>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <ThemedText style={styles.benefitText}>
                Save and sync your preferences
              </ThemedText>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.signupButton} onPress={navigateToSignup}>
              <Ionicons name="person-add" size={20} color="#fff" />
              <ThemedText style={styles.signupButtonText}>Create Account</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={navigateToLogin}>
              <Ionicons name="log-in" size={20} color="#8B4513" />
              <ThemedText style={styles.loginButtonText}>Login</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {userProfile?.fullName.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          </View>
          <ThemedText style={styles.userName}>{userProfile?.fullName}</ThemedText>
          <ThemedText style={styles.userEmail}>{userProfile?.email}</ThemedText>
        </View>

        <View style={styles.settingsSection}>
          <ThemedText style={styles.sectionTitle}>Account Settings</ThemedText>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setEditModalVisible(true)}>
            <View style={styles.settingLeft}>
              <Ionicons name="person" size={24} color="#8B4513" />
              <ThemedText style={styles.settingText}>Edit Profile</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0826D" />
          </TouchableOpacity>
        </View>

        <View style={styles.aboutSection}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setInfoModalVisible('about')}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle" size={24} color="#8B4513" />
              <ThemedText style={styles.settingText}>About IneteLearn</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0826D" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setInfoModalVisible('terms')}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text" size={24} color="#8B4513" />
              <ThemedText style={styles.settingText}>Terms & Privacy</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0826D" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setInfoModalVisible('help')}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle" size={24} color="#8B4513" />
              <ThemedText style={styles.settingText}>Help & Support</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0826D" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#F44336" />
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>

        <View style={styles.versionInfo}>
          <ThemedText style={styles.versionText}>
            IneteLearn v1.0.0 - ISUFST Dumangas
          </ThemedText>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Edit Profile</ThemedText>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.modalBody}>
              <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your full name"
                placeholderTextColor="#A0826D"
              />

              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={userProfile?.email}
                editable={false}
              />
              <ThemedText style={styles.helperText}>
                Email cannot be changed
              </ThemedText>

              <TouchableOpacity
                style={[styles.saveButton, isUpdating && { opacity: 0.6 }]}
                onPress={handleUpdateProfile}
                disabled={isUpdating}>
                {isUpdating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible !== null}
        onRequestClose={() => setInfoModalVisible(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {getInfoModalContent() && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleRow}>
                    <Ionicons 
                      name={getInfoModalContent()!.icon} 
                      size={28} 
                      color="#8B4513" 
                    />
                    <ThemedText style={styles.modalTitle}>
                      {getInfoModalContent()!.title}
                    </ThemedText>
                  </View>
                  <TouchableOpacity onPress={() => setInfoModalVisible(null)}>
                    <Ionicons name="close" size={28} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <ScrollView style={styles.infoModalBody}>
                  {getInfoModalContent()!.content.map((section, index) => (
                    <View key={index} style={styles.infoSection}>
                      <ThemedText style={styles.infoSectionLabel}>
                        {section.label}
                      </ThemedText>
                      <ThemedText style={styles.infoSectionText}>
                        {section.text}
                      </ThemedText>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: '#8B4513',
  },
  guestContainer: {
    padding: width * 0.05,
  },
  guestHeader: {
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  guestAvatarContainer: {
    position: 'relative',
  },
  guestBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B4513',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guestBadgeText: {
    color: '#fff',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  guestTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginTop: height * 0.02,
  },
  guestSubtitle: {
    fontSize: width * 0.04,
    color: '#A0826D',
    marginTop: height * 0.01,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8DC',
    padding: width * 0.05,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    marginBottom: height * 0.03,
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  infoText: {
    fontSize: width * 0.035,
    color: '#5D4E37',
    lineHeight: 20,
  },
  benefitsSection: {
    marginBottom: height * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: height * 0.02,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    padding: width * 0.04,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    marginBottom: 12,
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: width * 0.038,
    color: '#5D4E37',
    lineHeight: 22,
  },
  actionButtons: {
    gap: 12,
  },
  signupButton: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: height * 0.022,
    borderRadius: 12,
    gap: 8,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: height * 0.022,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B4513',
    gap: 8,
  },
  loginButtonText: {
    color: '#8B4513',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  userHeader: {
    alignItems: 'center',
    paddingVertical: height * 0.05,
    backgroundColor: '#F5F5DC',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFEF0',
  },
  avatarText: {
    fontSize: width * 0.12,
    fontWeight: 'bold',
    color: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  userName: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginTop: height * 0.02,
  },
  userEmail: {
    fontSize: width * 0.04,
    color: '#8B4513',
    marginTop: height * 0.005,
  },
  settingsSection: {
    margin: width * 0.04,
  },
  aboutSection: {
    margin: width * 0.04,
    marginTop: height * 0.01,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8DC',
    padding: width * 0.04,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: width * 0.04,
    color: '#5D4E37',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    margin: width * 0.04,
    padding: height * 0.02,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F44336',
    gap: 8,
  },
  logoutButtonText: {
    color: '#F44336',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  versionText: {
    fontSize: width * 0.033,
    color: '#A0826D',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.75,
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
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#5D4E37',
  },
  divider: {
    height: 2,
    backgroundColor: '#D2B48C',
  },
  modalBody: {
    padding: width * 0.05,
  },
  inputLabel: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#5D4E37',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFF8DC',
    borderWidth: 2,
    borderColor: '#D2B48C',
    borderRadius: 8,
    padding: 12,
    fontSize: width * 0.04,
    color: '#5D4E37',
  },
  inputDisabled: {
    opacity: 0.6,
  },
  helperText: {
    fontSize: width * 0.03,
    color: '#A0826D',
    marginTop: 4,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: height * 0.02,
    borderRadius: 12,
    marginTop: height * 0.03,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  infoModalBody: {
    padding: width * 0.05,
  },
  infoSection: {
    marginBottom: height * 0.025,
    paddingBottom: height * 0.025,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  infoSectionLabel: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: height * 0.01,
  },
  infoSectionText: {
    fontSize: width * 0.038,
    color: '#5D4E37',
    lineHeight: height * 0.028,
  },
  closeInfoButton: {
    backgroundColor: '#8B4513',
    padding: height * 0.018,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  closeInfoButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});
