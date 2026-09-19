import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { chewyPalettes, type ColorId } from '@/lib/theme';
import type { Equipped } from '@/lib/types';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

type Mood = 'idle' | 'walk' | 'celebrate';

export function Chewy({
  colorId,
  equipped,
  size = 196,
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
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: -1,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
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
      const wait = 2400 + Math.random() * 1800;
      Animated.sequence([
        Animated.delay(wait),
        Animated.timing(blink, { toValue: 0.08, duration: 80, useNativeDriver: false }),
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
          useNativeDriver: true,
        }),
        Animated.timing(walk, {
          toValue: -1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [mood, walk]);

  useEffect(() => {
    if (mood !== 'celebrate') return;
    Animated.sequence([
      Animated.timing(hop, { toValue: -18, duration: 180, useNativeDriver: true }),
      Animated.spring(hop, { toValue: 0, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [hop, mood]);

  const rotate = sway.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] });
  const translateY = Animated.add(
    hop,
    bob.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }),
  );
  const translateX = walk.interpolate({ inputRange: [-1, 1], outputRange: [-22, 22] });
  const eyeRy = blink.interpolate({ inputRange: [0, 1], outputRange: [0.8, 10] });
  const pupilRy = blink.interpolate({ inputRange: [0, 1], outputRange: [0.4, 6.2] });

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Chewy the baby alligator">
      <Animated.View
        style={{
          width: size,
          height: size * 1.08,
          transform: [{ translateX }, { translateY }, { rotate }],
        }}>
        <Svg width={size} height={size * 1.08} viewBox="0 0 220 240">
          <Path
            d="M168 148 C198 128 208 156 188 172 C176 180 164 168 168 148 Z"
            fill={palette.body}
            stroke={palette.outline}
            strokeWidth={3.2}
          />
          <Ellipse cx="78" cy="186" rx="18" ry="11" fill={palette.body} stroke={palette.outline} strokeWidth={3} />
          <Ellipse cx="138" cy="188" rx="18" ry="11" fill={palette.body} stroke={palette.outline} strokeWidth={3} />
          {equipped.accessory === 'boots' && (
            <>
              <Ellipse cx="78" cy="196" rx="16" ry="8" fill="#6B4A32" />
              <Ellipse cx="138" cy="198" rx="16" ry="8" fill="#6B4A32" />
            </>
          )}
          <Ellipse cx="110" cy="156" rx="62" ry="48" fill={palette.body} stroke={palette.outline} strokeWidth={3.4} />
          <Ellipse cx="118" cy="164" rx="38" ry="28" fill={palette.belly} />
          <Circle cx="86" cy="142" r="6" fill={palette.spots} opacity={0.75} />
          <Circle cx="72" cy="160" r="4.5" fill={palette.spots} opacity={0.6} />
          <Circle cx="96" cy="174" r="5" fill={palette.spots} opacity={0.55} />
          <Ellipse cx="62" cy="168" rx="13" ry="9" fill={palette.body} stroke={palette.outline} strokeWidth={2.6} />
          <Ellipse cx="154" cy="172" rx="13" ry="9" fill={palette.body} stroke={palette.outline} strokeWidth={2.6} />
          {equipped.accessory === 'backpack' && (
            <Ellipse cx="58" cy="150" rx="16" ry="20" fill="#C46A4A" stroke={palette.outline} strokeWidth={2.4} />
          )}
          <Circle cx="118" cy="96" r="54" fill={palette.body} stroke={palette.outline} strokeWidth={3.4} />
          <Circle cx="96" cy="108" r="10" fill="#E8A08C" opacity={0.55} />
          <Circle cx="148" cy="110" r="10" fill="#E8A08C" opacity={0.55} />
          <Ellipse cx="154" cy="118" rx="34" ry="22" fill={palette.body} stroke={palette.outline} strokeWidth={3} />
          <Ellipse cx="168" cy="120" rx="18" ry="12" fill={palette.belly} />
          <Circle cx="176" cy="114" r="2.4" fill={palette.outline} />
          <Circle cx="168" cy="112" r="2.4" fill={palette.outline} />
          <Path d="M148 128 Q168 140 186 126" stroke={palette.outline} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <Path d="M172 132 L176 140 L168 136 Z" fill={colorsSafeTooth} />
          {equipped.scarf === 'stripe-scarf' && (
            <Path d="M78 132 Q118 154 158 136" stroke="#E07A5F" strokeWidth="10" strokeLinecap="round" />
          )}
          {equipped.scarf === 'cozy-wrap' && (
            <Path d="M74 128 Q118 160 164 134" stroke="#6B8F5A" strokeWidth="14" strokeLinecap="round" />
          )}
          {equipped.accessory === 'lantern' && (
            <>
              <Rect x="28" y="86" width="4" height="52" rx="2" fill="#8A6238" />
              <Rect x="18" y="128" width="24" height="22" rx="6" fill="#F4D46A" stroke="#8A6238" strokeWidth="2" />
            </>
          )}
          {equipped.hat === 'leaf-hat' && (
            <Path
              d="M70 62 C98 18 168 28 164 68 C132 52 96 58 70 62 Z"
              fill="#6FA86A"
              stroke={palette.outline}
              strokeWidth={2.6}
            />
          )}
          {equipped.hat === 'flower-crown' && (
            <>
              <Circle cx="86" cy="50" r="10" fill="#F2A0B8" />
              <Circle cx="118" cy="40" r="11" fill="#F0C25A" />
              <Circle cx="150" cy="52" r="10" fill="#E39272" />
              <Circle cx="86" cy="50" r="4" fill="#FFF6D8" />
              <Circle cx="118" cy="40" r="4" fill="#FFF6D8" />
              <Circle cx="150" cy="52" r="4" fill="#FFF6D8" />
            </>
          )}
        </Svg>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={size} height={size * 1.08} viewBox="0 0 220 240">
            <AnimatedEllipse cx="100" cy="88" rx="13" ry={eyeRy} fill="#FFFDF8" />
            <AnimatedEllipse cx="136" cy="90" rx="13" ry={eyeRy} fill="#FFFDF8" />
            <AnimatedEllipse cx="102" cy="90" rx="6.4" ry={pupilRy} fill={palette.outline} />
            <AnimatedEllipse cx="138" cy="92" rx="6.4" ry={pupilRy} fill={palette.outline} />
            <Circle cx="105" cy="86" r="2.2" fill="#FFFDF8" />
            <Circle cx="141" cy="88" r="2.2" fill="#FFFDF8" />
          </Svg>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const colorsSafeTooth = '#FFF8E8';

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
