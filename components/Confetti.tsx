import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const PALETTE = ['#E8B86D', '#7BA37A', '#E39272', '#F0C2A0', '#6FAEA4', '#F4D46A', '#B197C6'];

type Piece = {
  left: number;
  delay: number;
  drift: number;
  spin: number;
  color: string;
  size: number;
};

export function Confetti({ token }: { token: number }) {
  const pieces = useMemo<Piece[]>(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      left: 8 + ((i * 37) % 84),
      delay: (i % 6) * 40,
      drift: (i % 2 === 0 ? 1 : -1) * (18 + (i % 5) * 8),
      spin: 140 + (i % 4) * 80,
      color: PALETTE[i % PALETTE.length],
      size: 7 + (i % 4) * 2,
    }));
  }, [token]);

  if (token <= 0) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((piece, i) => (
        <ConfettiBit key={`${token}-${i}`} piece={piece} />
      ))}
    </View>
  );
}

function ConfettiBit({ piece }: { piece: Piece }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 1100,
      delay: piece.delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [piece.delay, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [40, 320] });
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, piece.drift] });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${piece.spin}deg`],
  });
  const opacity = progress.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] });

  return (
    <Animated.View
      style={[
        styles.bit,
        {
          left: `${piece.left}%`,
          width: piece.size,
          height: piece.size * 1.4,
          backgroundColor: piece.color,
          opacity,
          transform: [{ translateY }, { translateX }, { rotate }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bit: {
    position: 'absolute',
    top: '18%',
    borderRadius: 2,
  },
});
