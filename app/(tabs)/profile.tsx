import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chewy } from '@/components/Chewy';
import { Card, GhostButton, PrimaryButton, Screen, ShellChip, Title } from '@/components/ui';
import { useApp } from '@/context/AppProvider';
import { FOCUS_OPTIONS } from '@/lib/catalog';
import { colors, fonts, radius } from '@/lib/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { state, level, renameChewy, resetDemo } = useApp();
  const [draft, setDraft] = useState(state.chewyName);
  const focuses = FOCUS_OPTIONS.filter((f) => state.focusAreas.includes(f.id))
    .map((f) => f.title)
    .join(' · ');

  const reset = () => {
    const run = async () => {
      await resetDemo();
      router.replace('/');
    };
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm('Reset the pond? This hatches a brand-new Chewy and clears local demo data.')) {
        void run();
      }
      return;
    }
    Alert.alert('Reset the pond?', 'This hatches a brand-new Chewy and clears local demo data.', [
      { text: 'Keep playing', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => void run() },
    ]);
  };

  return (
    <Screen>
      <View style={styles.head}>
        <Title>Profile</Title>
        <ShellChip shells={state.shells} />
      </View>
      <View style={styles.hero}>
        <Chewy colorId={state.colorId} equipped={state.equipped} size={150} />
      </View>
      <Card style={styles.stats}>
        <Stat label="Streak" value={`${state.streak} day${state.streak === 1 ? '' : 's'}`} />
        <Stat label="Level" value={`${level.level}`} />
        <Stat label="XP" value={`${level.into}/${level.need}`} />
      </Card>
      {state.streakGoal ? (
        <Text style={styles.note}>
          Soft goal: {Math.min(state.streak, state.streakGoal)} / {state.streakGoal} days
        </Text>
      ) : null}
      {state.plusDemo ? <Text style={styles.plus}>Plus demo badge on · still unpaid, still local</Text> : null}
      <Text style={styles.section}>Settings</Text>
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onEndEditing={() => renameChewy(draft)}
        style={styles.input}
        maxLength={16}
      />
      <Text style={styles.note}>Focus: {focuses || 'open pond'}</Text>
      <Pressable onPress={() => router.push('/plus')} style={styles.link}>
        <Text style={styles.linkText}>Open the mock Plus screen</Text>
      </Pressable>
      <View style={{ marginTop: 'auto', gap: 8, paddingBottom: 8 }}>
        <PrimaryButton label="Save name" onPress={() => renameChewy(draft)} />
        <GhostButton label="Reset demo data" onPress={reset} />
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statValue: {
    fontFamily: fonts.medium,
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
  },
  statLabel: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 2,
  },
  note: {
    marginTop: 10,
    color: colors.muted,
    fontWeight: '600',
  },
  plus: {
    marginTop: 8,
    color: colors.coral,
    fontWeight: '700',
  },
  section: {
    marginTop: 22,
    marginBottom: 8,
    fontFamily: fonts.medium,
    fontWeight: '800',
    fontSize: 18,
    color: colors.ink,
  },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: 'rgba(76, 122, 84, 0.16)',
    paddingHorizontal: 14,
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    fontFamily: fonts.medium,
  },
  link: {
    minHeight: 48,
    justifyContent: 'center',
  },
  linkText: {
    color: colors.moss,
    fontWeight: '800',
  },
});
