import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Chewy } from '@/components/Chewy';
import { Egg } from '@/components/Egg';
import { Garden } from '@/components/Garden';
import { Body, Dots, GhostButton, PrimaryButton, Screen, Title } from '@/components/ui';
import { useApp } from '@/context/AppProvider';
import { FOCUS_OPTIONS, STREAK_CHOICES } from '@/lib/catalog';
import { colors, colorOrder, chewyPalettes, fonts, radius, space, type ColorId } from '@/lib/theme';
import type { FocusId } from '@/lib/types';

const STEPS = 7;

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [colorId, setColorId] = useState<ColorId>('moss');
  const [cracks, setCracks] = useState(0);
  const [name, setName] = useState('Chewy');
  const [focus, setFocus] = useState<FocusId[]>(['mood', 'movement']);
  const [streakGoal, setStreakGoal] = useState<number | null>(5);
  const hatched = cracks >= 3;

  const emptyEquip = useMemo(
    () => ({ hat: null, scarf: null, accessory: null, backdrop: null }),
    [],
  );

  const next = () => setStep((s) => Math.min(STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = (plusSeen: boolean) => {
    completeOnboarding({
      chewyName: name,
      colorId,
      focusAreas: focus,
      streakGoal,
      plusSeen,
    });
    router.replace('/(tabs)');
  };

  const tapEgg = () => {
    setCracks((c) => {
      const nextCrack = Math.min(3, c + 1);
      if (nextCrack === 3) {
        setTimeout(() => setStep(2), 380);
      }
      return nextCrack;
    });
  };

  const toggleFocus = (id: FocusId) => {
    setFocus((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          {step > 0 ? <GhostButton label="Back" onPress={back} /> : <View style={{ width: 64 }} />}
          <Dots total={STEPS} index={step} />
          <View style={{ width: 64 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {step === 0 && (
            <View style={styles.block}>
              <Text style={styles.kicker}>A self-care pond</Text>
              <Title>Small care.{'\n'}Big adventures.</Title>
              <Body style={styles.lead}>
                Meet Chewy, a baby alligator who grows with you. Finish tiny real-world goals, fill an energy meter,
                and unlock lakeside quests.
              </Body>
              <View style={styles.hero}>
                <Garden />
                <Chewy colorId="moss" equipped={emptyEquip} size={220} mood="idle" />
              </View>
            </View>
          )}

          {step === 1 && (
            <View style={styles.block}>
              <Title>Hatch an egg</Title>
              <Body style={styles.lead}>Pick a colour, then tap the egg to help Chewy crack out.</Body>
              <View style={styles.swatches}>
                {colorOrder.map((id) => (
                  <Pressable
                    key={id}
                    onPress={() => {
                      setColorId(id);
                      setCracks(0);
                    }}
                    style={[
                      styles.swatch,
                      { backgroundColor: chewyPalettes[id].egg },
                      colorId === id && styles.swatchOn,
                    ]}
                    accessibilityLabel={chewyPalettes[id].label}
                  />
                ))}
              </View>
              <Text style={styles.colorName}>{chewyPalettes[colorId].label}</Text>
              <View style={styles.hero}>
                {hatched ? (
                  <Chewy colorId={colorId} equipped={emptyEquip} size={188} mood="celebrate" />
                ) : (
                  <Egg colorId={colorId} cracks={cracks} onPress={tapEgg} />
                )}
              </View>
              <Text style={styles.hint}>{hatched ? 'Hello, little snap.' : 'Tap, tap, tap.'}</Text>
            </View>
          )}

          {step === 2 && (
            <View style={styles.block}>
              <Title>Hi, I’m newly hatched.</Title>
              <Body style={styles.lead}>
                Still a little wrinkly. Very ready. Take care of yourself and I’ll gather energy for adventures around
                the lake.
              </Body>
              <View style={styles.hero}>
                <Chewy colorId={colorId} equipped={emptyEquip} size={210} mood="walk" />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.block}>
              <Title>What should I be called?</Title>
              <Body style={styles.lead}>Default is Chewy. Rename me whenever the mood strikes.</Body>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Chewy"
                placeholderTextColor={colors.locked}
                maxLength={16}
                style={styles.input}
                autoCapitalize="words"
              />
              <View style={styles.hero}>
                <Chewy colorId={colorId} equipped={emptyEquip} size={170} />
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={styles.block}>
              <Title>What shall we tend?</Title>
              <Body style={styles.lead}>Pick the kinds of care you want on your home list. You can skip none or choose all.</Body>
              <View style={styles.chips}>
                {FOCUS_OPTIONS.map((option) => {
                  const on = focus.includes(option.id);
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => toggleFocus(option.id)}
                      style={[styles.focus, on && styles.focusOn]}>
                      <Text style={styles.focusEmoji}>{option.emoji}</Text>
                      <Text style={[styles.focusTitle, on && styles.focusTitleOn]}>{option.title}</Text>
                      <Text style={styles.focusBlurb}>{option.blurb}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {step === 5 && (
            <View style={styles.block}>
              <Title>A gentle streak?</Title>
              <Body style={styles.lead}>Optional. Completing any goal today keeps the flame. Skip if you’re just exploring.</Body>
              <View style={styles.streakRow}>
                {STREAK_CHOICES.map((n) => (
                  <Pressable
                    key={n}
                    onPress={() => setStreakGoal(n)}
                    style={[styles.streak, streakGoal === n && styles.streakOn]}>
                    <Text style={[styles.streakNum, streakGoal === n && styles.streakNumOn]}>{n}</Text>
                    <Text style={styles.streakWord}>days</Text>
                  </Pressable>
                ))}
              </View>
              <GhostButton label="No streak goal for now" onPress={() => setStreakGoal(null)} />
              {streakGoal === null && <Text style={styles.hint}>Free-range it is.</Text>}
            </View>
          )}

          {step === 6 && (
            <View style={styles.block}>
              <Text style={styles.kicker}>Optional · not a real checkout</Text>
              <Title>Chewy Plus is pretend.</Title>
              <Body style={styles.lead}>
                This demo stays free. Plus is a dismissible preview — no payments, no account, no catch. Peek if you
                like, or hop straight to the pond.
              </Body>
              <View style={styles.plusCard}>
                <Text style={styles.plusTitle}>Soft extras, someday</Text>
                <Text style={styles.plusLine}>More lake maps in a future daydream</Text>
                <Text style={styles.plusLine}>Extra hats for a very dressed alligator</Text>
                <Text style={styles.plusLine}>Still just local data on this phone</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step === 0 && <PrimaryButton label="Let’s hatch" onPress={next} />}
          {step === 1 && <PrimaryButton label={hatched ? 'Meet Chewy' : 'Keep tapping the egg'} onPress={hatched ? next : tapEgg} />}
          {step === 2 && <PrimaryButton label={`Hi, ${name || 'Chewy'}`} onPress={next} />}
          {step === 3 && <PrimaryButton label="That's the name" onPress={next} />}
          {step === 4 && <PrimaryButton label="These feel right" onPress={next} />}
          {step === 5 && <PrimaryButton label="Continue" onPress={next} />}
          {step === 6 && (
            <>
              <PrimaryButton label="Peek at Plus" onPress={() => router.push('/plus')} />
              <PrimaryButton label="Skip into the garden" tone="paper" onPress={() => finish(true)} />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  block: {
    paddingTop: 8,
  },
  kicker: {
    fontFamily: fonts.medium,
    color: colors.sage,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 8,
  },
  lead: {
    marginTop: 10,
  },
  hero: {
    alignItems: 'center',
    marginTop: 20,
    minHeight: 248,
    justifyContent: 'center',
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#D8EDE3',
  },
  swatches: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  swatchOn: {
    borderColor: colors.ink,
    transform: [{ scale: 1.06 }],
  },
  colorName: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: fonts.medium,
    color: colors.muted,
    fontWeight: '700',
  },
  hint: {
    textAlign: 'center',
    marginTop: 8,
    fontFamily: fonts.medium,
    color: colors.sage,
    fontWeight: '700',
  },
  input: {
    marginTop: 18,
    minHeight: 56,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: 'rgba(76, 122, 84, 0.18)',
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
    fontFamily: fonts.medium,
  },
  chips: {
    marginTop: 16,
    gap: 10,
  },
  focus: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(76, 122, 84, 0.1)',
  },
  focusOn: {
    borderColor: colors.moss,
    backgroundColor: '#F3F8EF',
  },
  focusEmoji: {
    fontSize: 22,
  },
  focusTitle: {
    fontFamily: fonts.medium,
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 4,
  },
  focusTitleOn: {
    color: colors.moss,
  },
  focusBlurb: {
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 2,
  },
  streakRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 8,
  },
  streak: {
    flex: 1,
    minHeight: 92,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(76, 122, 84, 0.1)',
  },
  streakOn: {
    borderColor: colors.moss,
    backgroundColor: '#F3F8EF',
  },
  streakNum: {
    fontFamily: fonts.medium,
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },
  streakNumOn: {
    color: colors.moss,
  },
  streakWord: {
    color: colors.muted,
    fontWeight: '600',
  },
  plusCard: {
    marginTop: 20,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: 8,
  },
  plusTitle: {
    fontFamily: fonts.medium,
    fontWeight: '800',
    fontSize: 18,
    color: colors.ink,
    marginBottom: 4,
  },
  plusLine: {
    fontFamily: fonts.regular,
    color: colors.muted,
    fontSize: 15,
  },
  footer: {
    gap: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
});
