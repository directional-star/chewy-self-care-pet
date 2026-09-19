import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { chewyPalettes, type ColorId } from '@/lib/theme';

export function Egg({
  colorId,
  cracks,
  onPress,
  size = 180,
}: {
  colorId: ColorId;
  cracks: number;
  onPress: () => void;
  size?: number;
}) {
  const palette = chewyPalettes[colorId];
  const wobble = useRef(new Animated.Value(0)).current;
  const squash = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(wobble, {
          toValue: -1,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [wobble]);

  const tap = () => {
    Animated.sequence([
      Animated.timing(squash, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.spring(squash, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const rotate = wobble.interpolate({
    inputRange: [-1, 1],
    outputRange: cracks >= 2 ? ['-8deg', '8deg'] : ['-3deg', '3deg'],
  });

  return (
    <Pressable onPress={tap} accessibilityRole="button" accessibilityLabel="Tap egg to hatch Chewy">
      <Animated.View style={{ transform: [{ rotate }, { scale: squash }] }}>
        <Svg width={size} height={size * 1.2} viewBox="0 0 160 200">
          <Ellipse cx="80" cy="108" rx="54" ry="70" fill={palette.egg} stroke={palette.outline} strokeWidth={4} />
          <Ellipse cx="80" cy="118" rx="38" ry="48" fill={palette.belly} opacity={0.35} />
          <Ellipse cx="58" cy="88" rx="10" ry="14" fill={palette.eggSpot} opacity={0.7} />
          <Ellipse cx="96" cy="74" rx="8" ry="11" fill={palette.eggSpot} opacity={0.55} />
          <Ellipse cx="88" cy="132" rx="12" ry="9" fill={palette.eggSpot} opacity={0.45} />
          {cracks >= 1 && (
            <Path
              d="M80 48 L72 78 L86 92 L76 118"
              stroke={palette.outline}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
          )}
          {cracks >= 2 && (
            <>
              <Path
                d="M80 48 L92 82 L78 104 L90 136"
                stroke={palette.outline}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
              />
              <Path d="M54 96 L68 108" stroke={palette.outline} strokeWidth={2.6} strokeLinecap="round" />
              <Path d="M108 110 L94 122" stroke={palette.outline} strokeWidth={2.6} strokeLinecap="round" />
            </>
          )}
        </Svg>
        {cracks >= 2 && <View style={styles.spark} />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  spark: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F4D46A',
  },
});
