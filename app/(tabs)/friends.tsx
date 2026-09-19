import { useState } from 'react';
import { Platform, Share, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, Screen, Title } from '@/components/ui';
import { colors, fonts, radius } from '@/lib/theme';

const INVITE = 'Join me in Chewy — a tiny self-care pond for a baby alligator. https://chewy.app/invite/pond-demo';

export default function FriendsScreen() {
  const [copied, setCopied] = useState(false);

  const invite = async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(INVITE);
        setCopied(true);
        return;
      }
      await Share.share({ message: INVITE });
      setCopied(true);
    } catch {
      setCopied(true);
    }
  };

  return (
    <Screen>
      <Title>Pond pals</Title>
      <Text style={styles.sub}>Friends are a placeholder in this local demo. The pond is quiet — on purpose.</Text>
      <View style={styles.empty}>
        <Text style={styles.ripple}>◯ ◯</Text>
        <Text style={styles.emptyTitle}>No pals yet</Text>
        <Text style={styles.emptyBody}>
          Chewy is waiting on a lily pad. Invites don’t send a real message anywhere; they only copy a demo note.
        </Text>
        <PrimaryButton label={copied ? 'Invite note ready' : 'Copy invite placeholder'} onPress={invite} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: {
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 8,
    fontWeight: '600',
    lineHeight: 22,
  },
  empty: {
    marginTop: 28,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  ripple: {
    fontSize: 28,
    color: colors.lake,
    letterSpacing: 8,
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: fonts.medium,
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
  },
  emptyBody: {
    fontFamily: fonts.regular,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
});
