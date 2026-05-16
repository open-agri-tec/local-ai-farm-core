import type { GameState } from '../types/game';

export const STORAGE_KEY = 'local-ai-farm-core:v1';

export const loadGameState = (): GameState | null => {
  const rawState = localStorage.getItem(STORAGE_KEY);
  if (!rawState) {
    return null;
  }

  try {
    return JSON.parse(rawState) as GameState;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const saveGameState = (state: GameState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearGameState = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
