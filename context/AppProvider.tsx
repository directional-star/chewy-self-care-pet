import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';

import { pickDailyGoals, QUESTS, SHOP_ITEMS } from '@/lib/catalog';
import { todayKey, yesterdayKey, levelFromXp } from '@/lib/date';
import type { ColorId } from '@/lib/theme';
import {
  ENERGY_MAX,
  STARTER_ENERGY,
  STARTER_SHELLS,
  XP_PER_LEVEL,
  type AppState,
  type Equipped,
  type FocusId,
  type QuestProgress,
  type ShopSlot,
} from '@/lib/types';

const STORAGE_KEY = 'chewy.v1.state';

type OnboardPayload = {
  chewyName: string;
  colorId: ColorId;
  focusAreas: FocusId[];
  streakGoal: number | null;
  plusSeen: boolean;
};

type Action =
  | { type: 'HYDRATE'; state: AppState }
  | { type: 'COMPLETE_ONBOARDING'; payload: OnboardPayload }
  | { type: 'COMPLETE_GOAL'; id: string }
  | { type: 'SKIP_GOAL'; id: string }
  | { type: 'BUY'; id: string }
  | { type: 'EQUIP'; id: string }
  | { type: 'UNEQUIP'; slot: ShopSlot }
  | { type: 'START_QUEST'; id: string }
  | { type: 'COMPLETE_QUEST'; id: string }
  | { type: 'DISMISS_PLUS' }
  | { type: 'UNLOCK_PLUS_DEMO' }
  | { type: 'RENAME'; name: string }
  | { type: 'RESET' };

const emptyEquipped = (): Equipped => ({
  hat: null,
  scarf: null,
  accessory: null,
  backdrop: null,
});

const emptyQuests = (): Record<string, QuestProgress> =>
  Object.fromEntries(QUESTS.map((q) => [q.id, { startedAt: null, completedOn: null }]));

export function createInitialState(): AppState {
  return {
    onboarded: false,
    plusSeen: false,
    plusDemo: false,
    chewyName: 'Chewy',
    colorId: 'moss',
    focusAreas: [],
    streakGoal: null,
    shells: 0,
    energy: 0,
    xp: 0,
    streak: 0,
    lastActiveDate: todayKey(),
    lastStreakDate: null,
    goals: [],
    inventory: [],
    equipped: emptyEquipped(),
    quests: emptyQuests(),
    celebrateToken: 0,
  };
}

function applyRollover(state: AppState): AppState {
  const today = todayKey();
  if (state.lastActiveDate === today) return state;

  const keepStreak = state.lastStreakDate === yesterdayKey() || state.lastStreakDate === today;
  return {
    ...state,
    lastActiveDate: today,
    streak: keepStreak ? state.streak : 0,
    energy: STARTER_ENERGY,
    goals: pickDailyGoals(state.focusAreas),
    quests: Object.fromEntries(
      Object.entries(state.quests).map(([id, progress]) => [
        id,
        {
          startedAt: progress.startedAt,
          completedOn: progress.completedOn === today ? progress.completedOn : null,
        },
      ]),
    ),
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return applyRollover(action.state);
    case 'RESET':
      return createInitialState();
    case 'COMPLETE_ONBOARDING': {
      const name = action.payload.chewyName.trim() || 'Chewy';
      return {
        ...createInitialState(),
        onboarded: true,
        plusSeen: true,
        plusDemo: state.plusDemo,
        chewyName: name,
        colorId: action.payload.colorId,
        focusAreas: action.payload.focusAreas,
        streakGoal: action.payload.streakGoal,
        shells: STARTER_SHELLS,
        energy: STARTER_ENERGY,
        goals: pickDailyGoals(action.payload.focusAreas),
        lastActiveDate: todayKey(),
      };
    }
    case 'COMPLETE_GOAL': {
      const goal = state.goals.find((g) => g.id === action.id);
      if (!goal || goal.status !== 'open') return state;
      const today = todayKey();
      const firstToday = !state.goals.some((g) => g.status === 'done') && state.lastStreakDate !== today;
      return {
        ...state,
        goals: state.goals.map((g) => (g.id === action.id ? { ...g, status: 'done' } : g)),
        energy: Math.min(ENERGY_MAX, state.energy + goal.energy),
        shells: state.shells + goal.shells,
        xp: state.xp + goal.energy,
        streak: firstToday ? state.streak + 1 : state.streak,
        lastStreakDate: today,
        celebrateToken: state.celebrateToken + 1,
      };
    }
    case 'SKIP_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) => (g.id === action.id && g.status === 'open' ? { ...g, status: 'skipped' } : g)),
      };
    case 'BUY': {
      const item = SHOP_ITEMS.find((i) => i.id === action.id);
      if (!item || state.inventory.includes(item.id) || state.shells < item.price) return state;
      return {
        ...state,
        shells: state.shells - item.price,
        inventory: [...state.inventory, item.id],
        equipped: { ...state.equipped, [item.slot]: item.id },
      };
    }
    case 'EQUIP': {
      const item = SHOP_ITEMS.find((i) => i.id === action.id);
      if (!item || !state.inventory.includes(item.id)) return state;
      const already = state.equipped[item.slot] === item.id;
      return {
        ...state,
        equipped: { ...state.equipped, [item.slot]: already ? null : item.id },
      };
    }
    case 'UNEQUIP':
      return { ...state, equipped: { ...state.equipped, [action.slot]: null } };
    case 'START_QUEST': {
      const def = QUESTS.find((q) => q.id === action.id);
      const progress = state.quests[action.id];
      if (!def || !progress || progress.startedAt || progress.completedOn === todayKey()) return state;
      if (state.energy < def.needEnergy) return state;
      return {
        ...state,
        quests: {
          ...state.quests,
          [action.id]: { ...progress, startedAt: Date.now() },
        },
      };
    }
    case 'COMPLETE_QUEST': {
      const def = QUESTS.find((q) => q.id === action.id);
      const progress = state.quests[action.id];
      const today = todayKey();
      if (!def || !progress || !progress.startedAt || progress.completedOn === today) return state;
      if (Date.now() < progress.startedAt + def.seconds * 1000) return state;
      return {
        ...state,
        shells: state.shells + def.rewardShells,
        xp: state.xp + def.rewardXp,
        energy: Math.min(ENERGY_MAX, state.energy + 8),
        quests: {
          ...state.quests,
          [action.id]: { startedAt: null, completedOn: today },
        },
        celebrateToken: state.celebrateToken + 1,
      };
    }
    case 'DISMISS_PLUS':
      return { ...state, plusSeen: true };
    case 'UNLOCK_PLUS_DEMO':
      return { ...state, plusSeen: true, plusDemo: true };
    case 'RENAME': {
      const name = action.name.trim() || 'Chewy';
      return { ...state, chewyName: name };
    }
    default:
      return state;
  }
}

function isQuestUnlocked(state: AppState, questId: string): boolean {
  const def = QUESTS.find((q) => q.id === questId);
  if (!def) return false;
  const { level } = levelFromXp(state.xp, XP_PER_LEVEL);
  switch (def.unlock.type) {
    case 'always':
      return true;
    case 'level':
      return level >= def.unlock.level;
    case 'streak':
      return state.streak >= def.unlock.streak;
    case 'energy':
      return state.energy >= def.unlock.energy;
    case 'focus':
      return state.focusAreas.includes(def.unlock.focus);
    default:
      return false;
  }
}

type AppContextValue = {
  hydrated: boolean;
  state: AppState;
  level: { level: number; into: number; need: number };
  completeOnboarding: (payload: OnboardPayload) => void;
  completeGoal: (id: string) => void;
  skipGoal: (id: string) => void;
  buyItem: (id: string) => boolean;
  equipItem: (id: string) => void;
  startQuest: (id: string) => boolean;
  completeQuest: (id: string) => boolean;
  isQuestUnlocked: (id: string) => boolean;
  dismissPlus: () => void;
  unlockPlusDemo: () => void;
  renameChewy: (name: string) => void;
  resetDemo: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [hydrated, setHydrated] = useReducer(() => true, false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!alive) return;
        if (raw) {
          const parsed = JSON.parse(raw) as AppState;
          dispatch({
            type: 'HYDRATE',
            state: {
              ...createInitialState(),
              ...parsed,
              equipped: { ...emptyEquipped(), ...parsed.equipped },
              quests: { ...emptyQuests(), ...parsed.quests },
            },
          });
        }
      } catch {
        // Fresh pond if storage is unreadable.
      } finally {
        if (alive) setHydrated();
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [hydrated, state]);

  const completeOnboarding = useCallback((payload: OnboardPayload) => {
    dispatch({ type: 'COMPLETE_ONBOARDING', payload });
  }, []);

  const completeGoal = useCallback((id: string) => {
    dispatch({ type: 'COMPLETE_GOAL', id });
  }, []);

  const skipGoal = useCallback((id: string) => {
    dispatch({ type: 'SKIP_GOAL', id });
  }, []);

  const buyItem = useCallback(
    (id: string) => {
      const item = SHOP_ITEMS.find((i) => i.id === id);
      if (!item || state.inventory.includes(id) || state.shells < item.price) return false;
      dispatch({ type: 'BUY', id });
      return true;
    },
    [state.inventory, state.shells],
  );

  const equipItem = useCallback((id: string) => {
    dispatch({ type: 'EQUIP', id });
  }, []);

  const startQuest = useCallback(
    (id: string) => {
      const def = QUESTS.find((q) => q.id === id);
      if (!def || state.energy < def.needEnergy || !isQuestUnlocked(state, id)) return false;
      dispatch({ type: 'START_QUEST', id });
      return true;
    },
    [state],
  );

  const completeQuest = useCallback(
    (id: string) => {
      const def = QUESTS.find((q) => q.id === id);
      const progress = state.quests[id];
      if (!def || !progress?.startedAt) return false;
      if (Date.now() < progress.startedAt + def.seconds * 1000) return false;
      dispatch({ type: 'COMPLETE_QUEST', id });
      return true;
    },
    [state.quests],
  );

  const questUnlocked = useCallback((id: string) => isQuestUnlocked(state, id), [state]);

  const dismissPlus = useCallback(() => {
    dispatch({ type: 'DISMISS_PLUS' });
  }, []);

  const unlockPlusDemo = useCallback(() => {
    dispatch({ type: 'UNLOCK_PLUS_DEMO' });
  }, []);

  const renameChewy = useCallback((name: string) => {
    dispatch({ type: 'RENAME', name });
  }, []);

  const resetDemo = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  }, []);

  const level = useMemo(() => levelFromXp(state.xp, XP_PER_LEVEL), [state.xp]);

  const value = useMemo<AppContextValue>(
    () => ({
      hydrated,
      state,
      level,
      completeOnboarding,
      completeGoal,
      skipGoal,
      buyItem,
      equipItem,
      startQuest,
      completeQuest,
      isQuestUnlocked: questUnlocked,
      dismissPlus,
      unlockPlusDemo,
      renameChewy,
      resetDemo,
    }),
    [
      hydrated,
      state,
      level,
      completeOnboarding,
      completeGoal,
      skipGoal,
      buyItem,
      equipItem,
      startQuest,
      completeQuest,
      questUnlocked,
      dismissPlus,
      unlockPlusDemo,
      renameChewy,
      resetDemo,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
