import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '@/lib/theme';
import { ENERGY_MAX } from '@/lib/types';

export function EnergyMeter({ energy }: { energy: number }) {
  const pct = Math.max(0, Math.min(1, energy / ENERGY_MAX));
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>Energy</Text>
        <Text style={styles.value}>{energy}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(pct * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(255, 252, 246, 0.88)',
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(76, 122, 84, 0.12)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontFamily: fonts.medium,
    color: colors.muted,
    fontWeight: '700',
    fontSize: 13,
  },
  value: {
    fontFamily: fonts.medium,
    color: colors.ink,
    fontWeight: '800',
    fontSize: 13,
  },
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(111, 174, 164, 0.22)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: colors.lake,
  },
});
