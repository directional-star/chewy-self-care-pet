import { Platform } from 'react-native';

export const colors = {
  cream: '#F3EEE2',
  paper: '#FFF8ED',
  card: '#FFFCF6',
  ink: '#2A382C',
  muted: '#66756A',
  moss: '#4C7A54',
  sage: '#7BA37A',
  mint: '#CDE6C8',
  lake: '#6FAEA4',
  water: '#B6DDD3',
  sky: '#D8EDE3',
  peach: '#F0C2A0',
  coral: '#E39272',
  shell: '#E8B86D',
  gold: '#D4A03A',
  outline: '#3E5A42',
  locked: '#C8CEC3',
  white: '#FFFDF8',
  shadow: 'rgba(62, 74, 55, 0.12)',
};

export const fonts = {
  regular: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif',
    default: 'Nunito, "Avenir Next", ui-rounded, system-ui, sans-serif',
  }),
  medium: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif-medium',
    default: 'Nunito, "Avenir Next", ui-rounded, system-ui, sans-serif',
  }),
};

export const radius = {
  sm: 14,
  md: 20,
  lg: 28,
  xl: 36,
  pill: 999,
};

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export type ColorId = 'moss' | 'mint' | 'lemon' | 'peach' | 'sky' | 'lavender';

export type ChewyPalette = {
  id: ColorId;
  label: string;
  body: string;
  belly: string;
  spots: string;
  outline: string;
  egg: string;
  eggSpot: string;
};

export const chewyPalettes: Record<ColorId, ChewyPalette> = {
  moss: {
    id: 'moss',
    label: 'Pond moss',
    body: '#6B9B5E',
    belly: '#D2E7B4',
    spots: '#4E7A45',
    outline: '#35553A',
    egg: '#8FBF7A',
    eggSpot: '#5C8A52',
  },
  mint: {
    id: 'mint',
    label: 'River mint',
    body: '#6FC4B0',
    belly: '#D8F3EA',
    spots: '#3F9A86',
    outline: '#2A5F54',
    egg: '#8FD4C4',
    eggSpot: '#4FA892',
  },
  lemon: {
    id: 'lemon',
    label: 'Sun lemon',
    body: '#D2C453',
    belly: '#F4EEC2',
    spots: '#B3A236',
    outline: '#6F671C',
    egg: '#E4D56A',
    eggSpot: '#C0AE3C',
  },
  peach: {
    id: 'peach',
    label: 'Clay peach',
    body: '#E39A74',
    belly: '#F8DCCB',
    spots: '#C27554',
    outline: '#7A4632',
    egg: '#F0B392',
    eggSpot: '#D48460',
  },
  sky: {
    id: 'sky',
    label: 'Lake sky',
    body: '#74B0D2',
    belly: '#D6EBF7',
    spots: '#4589AE',
    outline: '#2C5770',
    egg: '#97C8E4',
    eggSpot: '#5A9BB8',
  },
  lavender: {
    id: 'lavender',
    label: 'Dusk bloom',
    body: '#B197C6',
    belly: '#EDE0F5',
    spots: '#886EA3',
    outline: '#56436C',
    egg: '#C9B3DC',
    eggSpot: '#9A80B4',
  },
};

export const colorOrder: ColorId[] = ['moss', 'mint', 'lemon', 'peach', 'sky', 'lavender'];
