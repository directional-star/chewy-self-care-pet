import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { colors } from '@/lib/theme';

export function Garden({ variant = 'day' }: { variant?: 'day' | 'sunset' | 'night' }) {
  const sky =
    variant === 'night'
      ? (['#1F2A44', '#3A4A6A', '#5C6E86'] as const)
      : variant === 'sunset'
        ? (['#F6C390', '#F3D7B0', '#E7E3C4'] as const)
        : (['#D6EFE4', '#E7F3DC', '#F3EEE2'] as const);
  const water = variant === 'night' ? '#3E6A78' : variant === 'sunset' ? '#E8A07A' : colors.lake;
  const hill = variant === 'night' ? '#2F4A3C' : variant === 'sunset' ? '#7A8F52' : '#8FBF7A';
  const hillBack = variant === 'night' ? '#24382E' : variant === 'sunset' ? '#C48A58' : '#A7C98A';

  return (
    <View style={[styles.wrap, { pointerEvents: 'none' }]}>
      <LinearGradient colors={[...sky]} style={StyleSheet.absoluteFill} />
      {variant === 'night' ? (
        <>
          <CircleDot x={48} y={36} size={7} color="#F7E7A8" />
          <CircleDot x={108} y={58} size={4} color="#F7E7A8" />
          <CircleDot x={268} y={30} size={5} color="#F7E7A8" />
          <CircleDot x={330} y={52} size={3} color="#F7E7A8" />
        </>
      ) : (
        <View style={[styles.sun, variant === 'sunset' ? styles.sunSet : null]} />
      )}
      <Svg width="100%" height="100%" viewBox="0 0 390 280" preserveAspectRatio="xMidYMax slice">
        <Ellipse cx="80" cy="168" rx="110" ry="40" fill={hillBack} />
        <Ellipse cx="310" cy="160" rx="130" ry="46" fill={hillBack} />
        <Path d="M0 186 C80 150 140 176 200 168 C270 158 320 176 390 154 L390 280 L0 280 Z" fill={hill} />
        <Path d="M0 214 C70 196 150 226 220 208 C300 188 340 220 390 204 L390 280 L0 280 Z" fill={water} />
        <Path
          d="M0 232 C90 218 160 246 240 228 C310 214 350 240 390 230 L390 280 L0 280 Z"
          fill={variant === 'night' ? '#2C5864' : '#9FCFC4'}
          opacity={0.55}
        />
        <Ellipse cx="70" cy="228" rx="22" ry="8" fill="#8FBF7A" />
        <Ellipse cx="118" cy="236" rx="16" ry="6" fill="#7BA37A" />
        <Ellipse cx="300" cy="232" rx="20" ry="7" fill="#8FBF7A" />
        <Path d="M48 228 C46 200 38 186 48 168" stroke="#4C7A54" strokeWidth="3" fill="none" />
        <Path d="M56 228 C62 204 70 190 58 172" stroke="#4C7A54" strokeWidth="3" fill="none" />
        <Ellipse cx="48" cy="166" rx="8" ry="14" fill="#6B9B5E" />
        <Ellipse cx="60" cy="170" rx="7" ry="12" fill="#4C7A54" />
        <Path d="M338 230 C346 200 360 186 350 166" stroke="#4C7A54" strokeWidth="3" fill="none" />
        <Ellipse cx="350" cy="164" rx="8" ry="13" fill="#6B9B5E" />
        {variant === 'night' && (
          <>
            <Circle cx="160" cy="200" r="2.4" fill="#F7E7A8" />
            <Circle cx="210" cy="214" r="2" fill="#F7E7A8" />
            <Circle cx="268" cy="198" r="2.6" fill="#F7E7A8" />
          </>
        )}
      </Svg>
    </View>
  );
}

function CircleDot({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  sun: {
    position: 'absolute',
    right: 28,
    top: 22,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F6E39A',
    shadowColor: '#F6E39A',
    shadowOpacity: 0.7,
    shadowRadius: 16,
  },
  sunSet: {
    backgroundColor: '#F0A36A',
    top: 36,
  },
});
