import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useApp } from '@/context/AppProvider';
import { colors, fonts } from '@/lib/theme';

export default function Index() {
  const { hydrated, state } = useApp();

  if (!hydrated) {
    return (
      <View style={styles.boot}>
        <Text style={styles.egg}>🥚</Text>
        <Text style={styles.word}>Warming the pond…</Text>
        <ActivityIndicator color={colors.moss} />
      </View>
    );
  }

  if (!state.onboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  egg: {
    fontSize: 42,
  },
  word: {
    fontFamily: fonts.medium,
    color: colors.muted,
    fontWeight: '700',
    fontSize: 16,
  },
});
