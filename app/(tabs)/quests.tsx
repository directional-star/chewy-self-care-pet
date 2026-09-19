import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Screen, ShellChip, Title } from '@/components/ui';
import { useApp } from '@/context/AppProvider';
import { QUESTS } from '@/lib/catalog';
import { colors, fonts, radius } from '@/lib/theme';

function remainingMs(startedAt: number | null, seconds: number) {
  if (!startedAt) return 0;
  return Math.max(0, startedAt + seconds * 1000 - Date.now());
}

export default function QuestsScreen() {
  const { state, startQuest, completeQuest, isQuestUnlocked } = useApp();
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 250);
    return () => clearInterval(id);
  }, []);

  return (
    <Screen>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Title>Quests</Title>
          <Text style={styles.sub}>Timed lake outings. Unlock them with energy, streaks, and levels.</Text>
        </View>
        <ShellChip shells={state.shells} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {QUESTS.map((quest) => {
          const progress = state.quests[quest.id];
          const unlocked = isQuestUnlocked(quest.id);
          const left = remainingMs(progress?.startedAt ?? null, quest.seconds);
          const running = Boolean(progress?.startedAt) && left > 0;
          const collectible = Boolean(progress?.startedAt) && left === 0 && !progress?.completedOn;
          const done = Boolean(progress?.completedOn);
          const lockedReason =
            !unlocked && quest.unlock.type === 'level'
              ? `Unlocks at level ${quest.unlock.level}`
              : !unlocked && quest.unlock.type === 'streak'
                ? `Needs a ${quest.unlock.streak}-day streak`
                : !unlocked && quest.unlock.type === 'energy'
                  ? `Needs ${quest.unlock.energy} energy`
                  : !unlocked && quest.unlock.type === 'focus'
                    ? 'Pick mindfulness during onboarding'
                    : state.energy < quest.needEnergy
                      ? `Need ${quest.needEnergy} energy`
                      : null;

          return (
            <Card key={quest.id} style={[styles.card, (!unlocked || done) && styles.dim]}>
              <Text style={styles.place}>{quest.place}</Text>
              <Text style={styles.title}>{quest.title}</Text>
              <Text style={styles.blurb}>{quest.blurb}</Text>
              <Text style={styles.meta}>
                {quest.needEnergy} energy · {quest.seconds}s · +{quest.rewardShells} 🐚
              </Text>
              {done ? (
                <Text style={styles.done}>Collected today. Come back tomorrow.</Text>
              ) : !unlocked ? (
                <Text style={styles.lock}>{lockedReason}</Text>
              ) : collectible ? (
                <Pressable onPress={() => completeQuest(quest.id)} style={styles.cta}>
                  <Text style={styles.ctaLabel}>Collect rewards</Text>
                </Pressable>
              ) : running ? (
                <Text style={styles.running}>{state.chewyName} is out · {Math.ceil(left / 1000)}s</Text>
              ) : (
                <Pressable
                  disabled={state.energy < quest.needEnergy}
                  onPress={() => startQuest(quest.id)}
                  style={[styles.cta, state.energy < quest.needEnergy && styles.ctaOff]}>
                  <Text style={styles.ctaLabel}>{lockedReason && state.energy < quest.needEnergy ? lockedReason : 'Start outing'}</Text>
                </Pressable>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  sub: {
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 6,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 28,
    gap: 12,
    paddingTop: 8,
  },
  card: {
    gap: 6,
  },
  dim: {
    opacity: 0.78,
  },
  place: {
    fontFamily: fonts.medium,
    color: colors.sage,
    fontWeight: '800',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
  },
  blurb: {
    fontFamily: fonts.regular,
    color: colors.muted,
    lineHeight: 21,
  },
  meta: {
    fontFamily: fonts.medium,
    color: colors.ink,
    fontWeight: '700',
    marginTop: 4,
  },
  lock: {
    marginTop: 6,
    color: colors.coral,
    fontWeight: '700',
  },
  done: {
    marginTop: 6,
    color: colors.sage,
    fontWeight: '700',
  },
  running: {
    marginTop: 8,
    color: colors.lake,
    fontWeight: '800',
  },
  cta: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaOff: {
    backgroundColor: colors.locked,
  },
  ctaLabel: {
    color: colors.white,
    fontWeight: '800',
    fontFamily: fonts.medium,
  },
});
