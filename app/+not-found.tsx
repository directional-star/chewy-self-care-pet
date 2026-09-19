import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/lib/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Lost the path' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This lily pad isn’t here.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Back to Chewy</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.cream,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
  },
  link: {
    marginTop: 16,
    paddingVertical: 12,
  },
  linkText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    fontWeight: '800',
    color: colors.moss,
  },
});
