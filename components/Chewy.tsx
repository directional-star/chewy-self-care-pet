import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { chewyPalettes, type ColorId } from '@/lib/theme';
import type { Equipped } from '@/lib/types';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const nativeDriver = Platform.OS !== 'web';

type Mood = 'idle' | 'walk' | 'celebrate';

export function Chewy({
  colorId,
  equipped,
  size = 210,
  mood = 'idle',
  onPress,
}: {
  colorId: ColorId;
  equipped: Equipped;
  size?: number;
  mood?: Mood;
  onPress?: () => void;
}) {
  const palette = chewyPalettes[colorId];
  const sway = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const walk = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;
  const hop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const swayLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: nativeDriver,
        }),
        Animated.timing(sway, {
          toValue: -1,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: nativeDriver,
        }),
      ]),
    );
    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: nativeDriver,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: nativeDriver,
        }),
      ]),
    );
    swayLoop.start();
    bobLoop.start();
    return () => {
      swayLoop.stop();
      bobLoop.stop();
    };
  }, [bob, sway]);

  useEffect(() => {
    let alive = true;
    const run = () => {
      Animated.sequence([
        Animated.delay(2400 + Math.random() * 1800),
        Animated.timing(blink, { toValue: 0.1, duration: 80, useNativeDriver: false }),
        Animated.timing(blink, { toValue: 1, duration: 110, useNativeDriver: false }),
      ]).start(({ finished }) => {
        if (finished && alive) run();
      });
    };
    run();
    return () => {
      alive = false;
    };
  }, [blink]);

  useEffect(() => {
    if (mood !== 'walk') {
      walk.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(walk, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: nativeDriver,
        }),
        Animated.timing(walk, {
          toValue: -1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: nativeDriver,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [mood, walk]);

  useEffect(() => {
    if (mood !== 'celebrate') return;
    Animated.sequence([
      Animated.timing(hop, { toValue: -18, duration: 180, useNativeDriver: nativeDriver }),
      Animated.spring(hop, { toValue: 0, friction: 4, useNativeDriver: nativeDriver }),
    ]).start();
  }, [hop, mood]);

  const rotate = sway.interpolate({ inputRange: [-1, 1], outputRange: ['-6deg', '6deg'] });
  const translateY = Animated.add(
    hop,
    bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }),
  );
  const translateX = walk.interpolate({ inputRange: [-1, 1], outputRange: [-20, 20] });
  const eyeRy = blink.interpolate({ inputRange: [0, 1], outputRange: [1, 11] });
  const pupilRy = blink.interpolate({ inputRange: [0, 1], outputRange: [0.5, 6] });

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Chewy the baby alligator">
      <Animated.View
        style={{
          width: size,
          height: size * 0.82,
          transform: [{ translateX }, { translateY }, { rotate }],
        }}>
        <Svg width={size} height={size * 0.82} viewBox="0 0 280 220">
          <Path
            d="M18 128 C12 108 28 86 58 92 C86 98 92 118 86 132 C70 128 40 138 18 128 Z"
            fill={palette.body}
            stroke={palette.outline}
            strokeWidth={3.4}
          />
          <Path
            d="M34 118 C46 108 62 112 70 122"
            stroke={palette.spots}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          <Ellipse cx="96" cy="176" rx="20" ry="12" fill={palette.body} stroke={palette.outline} strokeWidth={3} />
          <Ellipse cx="168" cy="180" rx="20" ry="12" fill={palette.body} stroke={palette.outline} strokeWidth={3} />
          {equipped.accessory === 'boots' && (
            <>
              <Ellipse cx="98" cy="188" rx="18" ry="8" fill="#6B4A32" />
              <Ellipse cx="170" cy="192" rx="18" ry="8" fill="#6B4A32" />
              <Rect x="88" y="180" width="8" height="10" rx="2" fill="#F0C25A" />
              <Rect x="160" y="184" width="8" height="10" rx="2" fill="#F0C25A" />
            </>
          )}
          <Path
            d="M72 150 C70 104 118 78 176 92 C214 102 228 128 216 156 C200 186 112 196 80 170 C74 164 72 158 72 150 Z"
            fill={palette.body}
            stroke={palette.outline}
            strokeWidth={3.6}
          />
          <Path d="M102 128 C128 90 186 96 204 128 C186 160 122 164 102 128 Z" fill={palette.belly} />
          <Circle cx="118" cy="112" r="6" fill={palette.spots} />
          <Circle cx="142" cy="102" r="5" fill={palette.spots} />
          <Circle cx="166" cy="110" r="6.5" fill={palette.spots} />
          <Path
            d="M96 108 C110 96 128 94 146 98"
            stroke={palette.spots}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <Ellipse cx="84" cy="156" rx="14" ry="10" fill={palette.body} stroke={palette.outline} strokeWidth={2.8} />
          <Ellipse cx="188" cy="162" rx="14" ry="10" fill={palette.body} stroke={palette.outline} strokeWidth={2.8} />
          {equipped.accessory === 'backpack' && (
            <Path
              d="M78 118 C70 118 64 130 68 148 C72 160 92 162 98 150 C100 136 90 118 78 118 Z"
              fill="#C46A4A"
              stroke={palette.outline}
              strokeWidth={2.6}
            />
          )}
          <Path
            d="M168 118 C176 78 214 62 248 78 C268 88 274 108 262 122 C248 138 214 142 196 132 C184 126 172 124 168 118 Z"
            fill={palette.body}
            stroke={palette.outline}
            strokeWidth={3.4}
          />
          <Ellipse cx="232" cy="108" rx="26" ry="16" fill={palette.belly} />
          <Circle cx="248" cy="98" r="3" fill={palette.outline} />
          <Circle cx="258" cy="102" r="3" fill={palette.outline} />
          <Path d="M214 116 Q236 128 258 114" stroke={palette.outline} strokeWidth={2.8} fill="none" strokeLinecap="round" />
          <Path d="M238 120 L244 130 L232 126 Z" fill="#FFF8E8" />
          <Circle cx="198" cy="86" r="12" fill="#E8A08C" opacity={0.45} />
          {equipped.scarf === 'stripe-scarf' && (
            <Path d="M150 128 Q184 150 214 128" stroke="#E07A5F" strokeWidth="12" strokeLinecap="round" />
          )}
          {equipped.scarf === 'cozy-wrap' && (
            <Path d="M146 126 Q184 156 218 130" stroke="#6B8F5A" strokeWidth="16" strokeLinecap="round" />
          )}
          {equipped.accessory === 'lantern' && (
            <>
              <Rect x="42" y="78" width="4" height="58" rx="2" fill="#8A6238" />
              <Rect x="32" y="124" width="24" height="22" rx="6" fill="#F4D46A" stroke="#8A6238" strokeWidth="2" />
            </>
          )}
          {equipped.hat === 'leaf-hat' && (
            <Path
              d="M150 78 C176 36 236 42 248 78 C216 64 176 70 150 78 Z"
              fill="#6FA86A"
              stroke={palette.outline}
              strokeWidth={2.6}
            />
          )}
          {equipped.hat === 'flower-crown' && (
            <>
              <Circle cx="176" cy="58" r="11" fill="#F2A0B8" />
              <Circle cx="202" cy="48" r="12" fill="#F0C25A" />
              <Circle cx="228" cy="60" r="11" fill="#E39272" />
              <Circle cx="176" cy="58" r="4" fill="#FFF6D8" />
              <Circle cx="202" cy="48" r="4" fill="#FFF6D8" />
              <Circle cx="228" cy="60" r="4" fill="#FFF6D8" />
            </>
          )}
        </Svg>
        <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
          <Svg width={size} height={size * 0.82} viewBox="0 0 280 220">
            <AnimatedEllipse cx="196" cy="86" rx="14" ry={eyeRy} fill="#FFFDF8" stroke={palette.outline} strokeWidth={2} />
            <AnimatedEllipse cx="202" cy="88" rx="6.5" ry={pupilRy} fill={palette.outline} />
            <Circle cx="205" cy="84" r="2.2" fill="#FFFDF8" />
          </Svg>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function MiniChewy({ colorId, size = 72 }: { colorId: ColorId; size?: number }) {
  return (
    <Chewy
      colorId={colorId}
      equipped={{ hat: null, scarf: null, accessory: null, backdrop: null }}
      size={size}
      mood="idle"
    />
  );
}
