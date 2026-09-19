import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chewy } from '@/components/Chewy';
import { Confetti } from '@/components/Confetti';
import { EnergyMeter } from '@/components/EnergyMeter';
import { Garden } from '@/components/Garden';
import { Card, Screen, ShellChip } from '@/components/ui';
import { useApp } from '@/context/AppProvider';
import { greeting } from '@/lib/date';
import { colors, fonts, radius } from '@/lib/theme';

export default function HomeScreen() {
  const { state, completeGoal, skipGoal } = useApp();
  const [tapped, setTapped] = useState(false);
  const backdrop =
    state.equipped.backdrop === 'night' ? 'night' : state.equipped.backdrop === 'sunset' ? 'sunset' : 'day';
  const mood = state.celebrateToken > 0 && tapped ? 'celebrate' : state.energy >= 35 ? 'walk' : 'idle';
  const doneCount = state.goals.filter((g) => g.status === 'done').length;
  const openGoals = state.goals.filter((g) => g.status === 'open');

  const headline = useMemo(() => {
    if (doneCount === 0) return `${greeting()}. ${state.chewyName} is stretching.`;
    if (openGoals.length === 0) return `${state.chewyName} is glowing. Pond day complete.`;
    return `${state.chewyName} gained a little sparkle.`;
  }, [doneCount, openGoals.length, state.chewyName]);

  return (
    <Screen padded={false} style={{ backgroundColor: colors.cream }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.gardenBox}>
          <Garden variant={backdrop} />
          <View style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.hello}>{headline}</Text>
            </View>
            <ShellChip shells={state.shells} />
          </View>
          <View style={styles.chewySlot}>
            <Chewy
              colorId={state.colorId}
              equipped={state.equipped}
              size={200}
              mood={mood}
              onPress={() => setTapped(true)}
            />
          </View>
          <View style={styles.meter}>
            <EnergyMeter energy={state.energy} />
          </View>
          <Confetti token={state.celebrateToken} />
        </View>

        <View style={styles.sheet}>
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>Today’s care</Text>
            <Text style={styles.sheetMeta}>
              {doneCount}/{state.goals.length} done
              {state.streakGoal ? ` · streak goal ${state.streakGoal}` : ''}
            </Text>
          </View>

          {state.goals.map((goal) => (
            <Card key={goal.id} style={[styles.goal, goal.status !== 'open' && styles.goalDim]}>
              <View style={styles.goalTop}>
                <Text style={styles.emoji}>{goal.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalHint}>{goal.hint}</Text>
                </View>
              </View>
              {goal.status === 'open' ? (
                <View style={styles.actions}>
                  <Pressable
                    onPress={() => {
                      setTapped(true);
                      completeGoal(goal.id);
                    }}
                    style={({ pressed }) => [styles.doneBtn, { opacity: pressed ? 0.85 : 1 }]}>
                    <Text style={styles.doneLabel}>I did it · +{goal.shells} 🐚</Text>
                  </Pressable>
                  <Pressable onPress={() => skipGoal(goal.id)} style={styles.skipBtn}>
                    <Text style={styles.skipLabel}>Skip</Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.status}>{goal.status === 'done' ? 'Complete — Chewy felt that.' : 'Skipped for today.'}</Text>
              )}
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 28,
  },
  gardenBox: {
    height: 390,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#D6EFE4',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  hello: {
    fontFamily: fonts.medium,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: colors.ink,
  },
  chewySlot: {
    alignItems: 'center',
    marginTop: 8,
  },
  meter: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 12,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 12,
  },
  sheetHead: {
    marginBottom: 4,
  },
  sheetTitle: {
    fontFamily: fonts.medium,
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
  },
  sheetMeta: {
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 2,
    fontWeight: '600',
  },
  goal: {
    gap: 12,
  },
  goalDim: {
    opacity: 0.62,
  },
  goalTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  emoji: {
    fontSize: 26,
    width: 36,
    textAlign: 'center',
  },
  goalTitle: {
    fontFamily: fonts.medium,
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  goalHint: {
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  doneBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  doneLabel: {
    color: colors.white,
    fontWeight: '800',
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  skipBtn: {
    minHeight: 48,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipLabel: {
    color: colors.muted,
    fontWeight: '700',
  },
  status: {
    fontFamily: fonts.medium,
    color: colors.sage,
    fontWeight: '700',
  },
});
