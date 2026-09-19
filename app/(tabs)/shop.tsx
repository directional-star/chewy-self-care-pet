import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chewy } from '@/components/Chewy';
import { Card, Screen, ShellChip, Title } from '@/components/ui';
import { useApp } from '@/context/AppProvider';
import { SHOP_ITEMS } from '@/lib/catalog';
import { colors, fonts, radius } from '@/lib/theme';

export default function ShopScreen() {
  const { state, buyItem, equipItem } = useApp();

  return (
    <Screen>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Title>Shell shop</Title>
          <Text style={styles.sub}>Local cosmetics only. Spend shells you earned from care.</Text>
        </View>
        <ShellChip shells={state.shells} />
      </View>
      <View style={styles.preview}>
        <Chewy colorId={state.colorId} equipped={state.equipped} size={150} mood="idle" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {SHOP_ITEMS.map((item) => {
          const owned = state.inventory.includes(item.id);
          const on = state.equipped[item.slot] === item.id;
          const tooPoor = !owned && state.shells < item.price;
          return (
            <Card key={item.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.slot}>{item.slot}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.blurb}>{item.blurb}</Text>
              </View>
              <Pressable
                disabled={tooPoor}
                onPress={() => (owned ? equipItem(item.id) : buyItem(item.id))}
                style={[styles.btn, tooPoor && styles.btnOff, on && styles.btnOn]}>
                <Text style={[styles.btnLabel, on && styles.btnLabelOn]}>
                  {on ? 'Wearing' : owned ? 'Put on' : `${item.price} 🐚`}
                </Text>
              </Pressable>
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
  },
  sub: {
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 6,
    fontWeight: '600',
  },
  preview: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  list: {
    gap: 10,
    paddingBottom: 28,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slot: {
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.sage,
    fontWeight: '800',
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  blurb: {
    color: colors.muted,
    marginTop: 2,
  },
  btn: {
    minHeight: 48,
    minWidth: 92,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOff: {
    backgroundColor: colors.locked,
  },
  btnOn: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.moss,
  },
  btnLabel: {
    color: colors.white,
    fontWeight: '800',
  },
  btnLabelOn: {
    color: colors.moss,
  },
});
