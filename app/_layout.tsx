import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'welcome',
};

// Custom Light Theme (Dictionary-inspired)
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8B4513',        // Saddle brown - main accent color
    background: '#FFFEF0',     // Cream/off-white - page background
    card: '#FFF8DC',           // Cornsilk - card background
    text: '#5D4E37',           // Dark brown - primary text
    border: '#D2B48C',         // Tan - borders
    notification: '#CD853F',   // Peru - notifications
  },
};

// Custom Dark Theme (Dictionary-inspired dark mode)
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#D2B48C',        // Tan - main accent color (lighter for dark mode)
    background: '#2C2416',     // Very dark brown - page background
    card: '#3D3020',           // Dark tan - card background
    text: '#F5F5DC',           // Beige - primary text
    border: '#5D4E37',         // Medium brown - borders
    notification: '#CD853F',   // Peru - notifications
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#2C2416' : '#F5F5DC',
          },
          headerTintColor: colorScheme === 'dark' ? '#F5F5DC' : '#5D4E37',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'serif',
          },
        }}>
        <Stack.Screen 
          name="welcome"
          options={{ headerShown: false }}
        />
      <Stack.Screen 
          name="login" 
          options={{ headerShown: false }} 
        />
      <Stack.Screen 
          name="signup" 
          options={{ headerShown: false }} 
        />
      <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
      <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal', 
            title: 'Details',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#3D3020' : '#FFF8DC',
            },
          }} 
        />
        <Stack.Screen 
          name="dictionary" 
          options={{ 
            title: 'Dictionary',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#3D3020' : '#FFF8DC',
            },
          }} 
        />
        <Stack.Screen 
          name="translate" 
          options={{ 
            title: 'Translate',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#3D3020' : '#FFF8DC',
            },
          }} 
        />
        <Stack.Screen 
          name="quiz" 
          options={{ 
            title: 'Quiz',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#3D3020' : '#FFF8DC',
            },
          }} 
        />
        <Stack.Screen 
          name="community" 
          options={{ 
            title: 'Community',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#3D3020' : '#FFF8DC',
            },
          }} 
        />
        <Stack.Screen 
          name="downloads" 
          options={{ 
            title: 'Downloads',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#3D3020' : '#FFF8DC',
            },
          }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ 
            title: 'Profile',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#3D3020' : '#FFF8DC',
            },
          }} 
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
