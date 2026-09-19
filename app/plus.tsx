import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Body, GhostButton, PrimaryButton, Screen, Title } from '@/components/ui';
import { useApp } from '@/context/AppProvider';
import { colors, fonts, radius } from '@/lib/theme';

export default function PlusScreen() {
  const router = useRouter();
  const { unlockPlusDemo, dismissPlus } = useApp();

  const close = (joinDemo: boolean) => {
    if (joinDemo) unlockPlusDemo();
    else dismissPlus();
    router.back();
  };

  return (
    <Screen>
      <GhostButton label="Close" onPress={() => close(false)} style={{ alignSelf: 'flex-start' }} />
      <Text style={styles.kicker}>Demo only · nothing to buy</Text>
      <Title>Chewy Plus</Title>
      <Body style={styles.lead}>
        A warm preview of extras that could exist later. This screen cannot charge you. There is no store, receipt, or
        subscription.
      </Body>

      <View style={styles.list}>
        {[
          'Daydream lake maps',
          'A wider hat collection',
          'Longer quest chapters',
          'Still saved only on this device',
        ].map((line) => (
          <View key={line} style={styles.row}>
            <Text style={styles.mark}>✦</Text>
            <Text style={styles.line}>{line}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Pretend to join Plus" onPress={() => close(true)} />
        <PrimaryButton label="No thanks, stay free" tone="paper" onPress={() => close(false)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    marginTop: 8,
    fontFamily: fonts.medium,
    color: colors.coral,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  lead: {
    marginTop: 10,
  },
  list: {
    marginTop: 24,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 18,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  mark: {
    color: colors.gold,
    fontSize: 16,
    marginTop: 1,
  },
  line: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.ink,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    gap: 10,
    paddingBottom: 8,
  },
});
