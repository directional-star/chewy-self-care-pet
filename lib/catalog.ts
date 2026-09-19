import type { FocusId, Goal, QuestDef, ShopItem } from '@/lib/types';

export const FOCUS_OPTIONS: { id: FocusId; title: string; blurb: string; emoji: string }[] = [
  { id: 'mood', title: 'Mood', blurb: 'Tiny lifts for a kinder day', emoji: '🌤️' },
  { id: 'sleep', title: 'Sleep', blurb: 'Softer nights, gentler mornings', emoji: '🌙' },
  { id: 'movement', title: 'Movement', blurb: 'Short walks and stretchy reeds', emoji: '🚶' },
  { id: 'mindfulness', title: 'Mindfulness', blurb: 'Breath, noticing, quiet water', emoji: '🪷' },
];

export const GOAL_POOL: Omit<Goal, 'status'>[] = [
  {
    id: 'water',
    title: 'Drink a glass of water',
    hint: 'Chewy takes a sip too.',
    emoji: '💧',
    focus: 'movement',
    energy: 12,
    shells: 6,
  },
  {
    id: 'teeth',
    title: 'Brush your teeth',
    hint: 'Sparkly smiles, tiny teeth.',
    emoji: '🦷',
    focus: 'mood',
    energy: 12,
    shells: 6,
  },
  {
    id: 'walk',
    title: 'Take a short walk',
    hint: 'Even to the mailbox counts.',
    emoji: '🚶',
    focus: 'movement',
    energy: 18,
    shells: 10,
  },
  {
    id: 'stretch',
    title: 'Stretch for two minutes',
    hint: 'Reach like a reed in the wind.',
    emoji: '🙆',
    focus: 'movement',
    energy: 14,
    shells: 8,
  },
  {
    id: 'sun',
    title: 'Stand in daylight',
    hint: 'Warm scales, warmer mood.',
    emoji: '☀️',
    focus: 'mood',
    energy: 12,
    shells: 7,
  },
  {
    id: 'breath',
    title: 'Three slow breaths',
    hint: 'In like a tide. Out like a tide.',
    emoji: '🌬️',
    focus: 'mindfulness',
    energy: 14,
    shells: 8,
  },
  {
    id: 'journal',
    title: 'Jot one feeling',
    hint: 'A pebble of honesty is enough.',
    emoji: '✏️',
    focus: 'mindfulness',
    energy: 16,
    shells: 9,
  },
  {
    id: 'sleep',
    title: 'Set a wind-down time',
    hint: 'Dim the pond lights a little.',
    emoji: '🌙',
    focus: 'sleep',
    energy: 16,
    shells: 9,
  },
  {
    id: 'screens',
    title: 'Park the phone for 10 minutes',
    hint: 'Look at real water, or a window.',
    emoji: '📵',
    focus: 'sleep',
    energy: 15,
    shells: 8,
  },
  {
    id: 'tidy',
    title: 'Tidy one small surface',
    hint: 'A calmer nest for later you.',
    emoji: '🧺',
    focus: 'mood',
    energy: 13,
    shells: 7,
  },
  {
    id: 'friend',
    title: 'Send a kind ping',
    hint: 'A ripple to someone you like.',
    emoji: '💌',
    focus: 'mood',
    energy: 14,
    shells: 8,
  },
  {
    id: 'nourish',
    title: 'Eat something nourishing',
    hint: 'Fuel for tiny adventures.',
    emoji: '🍓',
    focus: 'movement',
    energy: 13,
    shells: 7,
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'leaf-hat', name: 'Lily leaf cap', blurb: 'Shady and slightly damp.', slot: 'hat', price: 28 },
  { id: 'flower-crown', name: 'Marsh blossom crown', blurb: 'Three shy flowers, very proud.', slot: 'hat', price: 46 },
  { id: 'stripe-scarf', name: 'Reed-stripe scarf', blurb: 'For breezy lake mornings.', slot: 'scarf', price: 36 },
  { id: 'cozy-wrap', name: 'Warm moss wrap', blurb: 'Tucked-in and toasty.', slot: 'scarf', price: 42 },
  { id: 'boots', name: 'Mudskipper boots', blurb: 'Squelch with confidence.', slot: 'accessory', price: 32 },
  { id: 'lantern', name: 'Firefly lantern', blurb: 'A portable dusk.', slot: 'accessory', price: 48 },
  { id: 'backpack', name: 'Pebble pack', blurb: 'Holds snacks and secrets.', slot: 'accessory', price: 54 },
  { id: 'sunset', name: 'Apricot dusk sky', blurb: 'Paints the pond gold.', slot: 'backdrop', price: 60 },
  { id: 'night', name: 'Moonlit pond', blurb: 'Soft indigo and fireflies.', slot: 'backdrop', price: 70 },
];

export const QUESTS: QuestDef[] = [
  {
    id: 'reeds',
    title: 'Reed stretch',
    blurb: 'Sway with the cattails until your shoulders drop.',
    place: 'North reeds',
    needEnergy: 18,
    seconds: 8,
    rewardShells: 14,
    rewardXp: 20,
    unlock: { type: 'always' },
  },
  {
    id: 'paddle',
    title: 'Lily-pad paddle',
    blurb: 'A short glide across the still water.',
    place: 'Open lake',
    needEnergy: 36,
    seconds: 12,
    rewardShells: 22,
    rewardXp: 28,
    unlock: { type: 'level', level: 2 },
  },
  {
    id: 'journal-quest',
    title: 'Rainy-day notebook',
    blurb: 'Sit under a leaf and write one true sentence.',
    place: 'Covered dock',
    needEnergy: 28,
    seconds: 10,
    rewardShells: 18,
    rewardXp: 24,
    unlock: { type: 'focus', focus: 'mindfulness' },
  },
  {
    id: 'firefly',
    title: 'Firefly stroll',
    blurb: 'Follow the sparkles until the path feels enough.',
    place: 'Dusk path',
    needEnergy: 50,
    seconds: 14,
    rewardShells: 30,
    rewardXp: 36,
    unlock: { type: 'energy', energy: 48 },
  },
  {
    id: 'picnic',
    title: 'Weekend picnic',
    blurb: 'A blanket, a berry, a long blink in the sun.',
    place: 'Sunny bank',
    needEnergy: 40,
    seconds: 16,
    rewardShells: 26,
    rewardXp: 32,
    unlock: { type: 'streak', streak: 3 },
  },
  {
    id: 'night-swim',
    title: 'Night swim',
    blurb: 'Quiet water, bright moon, brave little splash.',
    place: 'Deep cove',
    needEnergy: 70,
    seconds: 18,
    rewardShells: 40,
    rewardXp: 48,
    unlock: { type: 'level', level: 3 },
  },
];

export const STREAK_CHOICES = [3, 5, 7] as const;

export function pickDailyGoals(focusAreas: FocusId[]): Goal[] {
  const always = GOAL_POOL.filter((g) => g.id === 'water' || g.id === 'teeth');
  const focused = GOAL_POOL.filter(
    (g) => g.id !== 'water' && g.id !== 'teeth' && (focusAreas.length === 0 || focusAreas.includes(g.focus)),
  );
  const extras = focused.slice(0, 3);
  const fallback = GOAL_POOL.filter((g) => !always.includes(g) && !extras.includes(g)).slice(
    0,
    Math.max(0, 3 - extras.length),
  );
  return [...always, ...extras, ...fallback].slice(0, 5).map((g) => ({ ...g, status: 'open' }));
}
