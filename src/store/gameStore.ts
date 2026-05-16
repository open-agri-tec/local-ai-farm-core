import { useEffect, useMemo, useState } from 'react';
import type { Feed, GameLog, GameState, Monster } from '../types/game';
import { createId } from '../utils/id';
import { clearGameState, loadGameState, saveGameState } from '../utils/storage';

const INITIAL_STATE: GameState = {
  monsters: [],
  activeMonsterId: null,
  feeds: [],
  logs: [],
};

const now = (): string => new Date().toISOString();

const createLog = (message: string): GameLog => ({
  id: createId('log'),
  message,
  createdAt: now(),
});

const memoToFeedAmount = (memo: string): number => Math.max(1, Math.ceil(memo.trim().length / 10));

export const useGameStore = () => {
  const [state, setState] = useState<GameState>(() => loadGameState() ?? INITIAL_STATE);

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const activeMonster = useMemo(
    () => state.monsters.find((monster) => monster.id === state.activeMonsterId) ?? null,
    [state.activeMonsterId, state.monsters],
  );

  const createEgg = (name: string) => {
    const trimmedName = name.trim() || `タマゴ ${state.monsters.length + 1}`;
    const timestamp = now();
    const monster: Monster = {
      id: createId('monster'),
      name: trimmedName,
      exp: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setState((current) => ({
      ...current,
      monsters: [...current.monsters, monster],
      activeMonsterId: monster.id,
      logs: [createLog(`${monster.name} のタマゴを作成しました。`), ...current.logs],
    }));
  };

  const switchActiveMonster = (monsterId: string) => {
    setState((current) => ({
      ...current,
      activeMonsterId: monsterId,
      logs: [createLog('activeMonsterを切り替えました。'), ...current.logs],
    }));
  };

  const createFeedFromMemo = (memo: string) => {
    const sourceMemo = memo.trim();
    if (!sourceMemo) {
      return;
    }

    const feed: Feed = {
      id: createId('feed'),
      sourceMemo,
      amount: memoToFeedAmount(sourceMemo),
      createdAt: now(),
    };

    setState((current) => ({
      ...current,
      feeds: [feed, ...current.feeds],
      logs: [createLog(`メモからエサを作成しました（EXP +${feed.amount}）。`), ...current.logs],
    }));
  };

  const feedActiveMonster = (feedId: string) => {
    setState((current) => {
      const feed = current.feeds.find((item) => item.id === feedId);
      const active = current.monsters.find((monster) => monster.id === current.activeMonsterId);
      if (!feed || !active) {
        return current;
      }

      return {
        ...current,
        monsters: current.monsters.map((monster) =>
          monster.id === active.id
            ? { ...monster, exp: monster.exp + feed.amount, updatedAt: now() }
            : monster,
        ),
        feeds: current.feeds.filter((item) => item.id !== feed.id),
        logs: [createLog(`${active.name} にエサをあげました（EXP +${feed.amount}）。`), ...current.logs],
      };
    });
  };

  const resetGame = () => {
    clearGameState();
    setState({
      ...INITIAL_STATE,
      logs: [createLog('ゲームを初期化しました。')],
    });
  };

  const exportJson = (): string => JSON.stringify(state, null, 2);

  return {
    state,
    activeMonster,
    createEgg,
    switchActiveMonster,
    createFeedFromMemo,
    feedActiveMonster,
    resetGame,
    exportJson,
  };
};
