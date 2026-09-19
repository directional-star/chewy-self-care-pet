import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radius, space } from '@/lib/theme';

export function Screen({
  children,
  style,
  padded = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.screen,
        { paddingTop: Math.max(insets.top, 12), paddingBottom: insets.bottom },
        padded && { paddingHorizontal: space.lg },
        style,
      ]}>
      {children}
    </View>
  );
}

export function SoftGradient({ children }: { children?: React.ReactNode }) {
  return (
    <LinearGradient colors={[colors.sky, colors.cream, colors.paper]} style={StyleSheet.absoluteFill}>
      {children}
    </LinearGradient>
  );
}

export function Title({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = 'moss',
  style,
}: {
  label: string;
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
  tone?: 'moss' | 'coral' | 'paper';
  style?: StyleProp<ViewStyle>;
}) {
  const bg = tone === 'moss' ? colors.moss : tone === 'coral' ? colors.coral : colors.card;
  const fg = tone === 'paper' ? colors.ink : colors.white;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primary,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.86 : 1 },
        tone === 'paper' && styles.primaryOutline,
        style,
      ]}>
      <Text style={[styles.primaryLabel, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.ghost, { opacity: pressed ? 0.6 : 1 }, style]}>
      <Text style={styles.ghostLabel}>{label}</Text>
    </Pressable>
  );
}

export function ShellChip({ shells }: { shells: number }) {
  return (
    <View style={styles.shellChip}>
      <Text style={styles.shellIcon}>🐚</Text>
      <Text style={styles.shellCount}>{shells}</Text>
    </View>
  );
}

export function Dots({ total, index }: { total: number; index: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 30,
    lineHeight: 36,
    color: colors.ink,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 23,
    color: colors.muted,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: 'rgba(79, 122, 86, 0.08)',
    shadowColor: '#3E4A37',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  primary: {
    minHeight: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  primaryOutline: {
    borderWidth: 1.5,
    borderColor: 'rgba(76, 122, 84, 0.22)',
  },
  primaryLabel: {
    fontFamily: fonts.medium,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  ghost: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  ghostLabel: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.moss,
    fontWeight: '700',
  },
  shellChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    minHeight: 36,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(232, 184, 109, 0.45)',
  },
  shellIcon: {
    fontSize: 14,
  },
  shellCount: {
    fontFamily: fonts.medium,
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(76, 122, 84, 0.18)',
  },
  dotOn: {
    width: 22,
    backgroundColor: colors.moss,
  },
});
