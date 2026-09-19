import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from '@/context/AppProvider';
import { colors } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});
LogBox.ignoreLogs(['collapsable', 'useNativeDriver', 'pointerEvents', 'boxShadow', 'shadow']);
if (Platform.OS === 'web') {
  LogBox.ignoreAllLogs(true);
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.cream,
    card: colors.paper,
    text: colors.ink,
    border: 'transparent',
    primary: colors.moss,
  },
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const id = 'chewy-nunito';
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800&display=swap';
        document.head.appendChild(link);
      }
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <ThemeProvider value={navTheme}>
          <View style={styles.outer}>
            <View style={styles.phone}>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="plus" options={{ presentation: 'modal' }} />
              </Stack>
            </View>
          </View>
        </ThemeProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#E4DDD0' : colors.cream,
    alignItems: 'center',
  },
  phone: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.cream,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 18px 50px rgba(62, 74, 55, 0.16)',
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#d8d0c2',
        }
      : {}),
  },
});
