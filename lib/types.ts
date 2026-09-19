import type { ColorId } from '@/lib/theme';

export type FocusId = 'mood' | 'sleep' | 'movement' | 'mindfulness';

export type GoalStatus = 'open' | 'done' | 'skipped';

export type Goal = {
  id: string;
  title: string;
  hint: string;
  emoji: string;
  focus: FocusId;
  energy: number;
  shells: number;
  status: GoalStatus;
};

export type ShopSlot = 'hat' | 'scarf' | 'accessory' | 'backdrop';

export type ShopItem = {
  id: string;
  name: string;
  blurb: string;
  slot: ShopSlot;
  price: number;
};

export type QuestUnlock =
  | { type: 'always' }
  | { type: 'level'; level: number }
  | { type: 'streak'; streak: number }
  | { type: 'energy'; energy: number }
  | { type: 'focus'; focus: FocusId };

export type QuestDef = {
  id: string;
  title: string;
  blurb: string;
  place: string;
  needEnergy: number;
  seconds: number;
  rewardShells: number;
  rewardXp: number;
  unlock: QuestUnlock;
};

export type QuestProgress = {
  startedAt: number | null;
  completedOn: string | null;
};

export type Equipped = Record<ShopSlot, string | null>;

export type AppState = {
  onboarded: boolean;
  plusSeen: boolean;
  plusDemo: boolean;
  chewyName: string;
  colorId: ColorId;
  focusAreas: FocusId[];
  streakGoal: number | null;
  shells: number;
  energy: number;
  xp: number;
  streak: number;
  lastActiveDate: string;
  lastStreakDate: string | null;
  goals: Goal[];
  inventory: string[];
  equipped: Equipped;
  quests: Record<string, QuestProgress>;
  celebrateToken: number;
};

export const XP_PER_LEVEL = 80;
export const ENERGY_MAX = 100;
export const STARTER_SHELLS = 24;
export const STARTER_ENERGY = 22;
