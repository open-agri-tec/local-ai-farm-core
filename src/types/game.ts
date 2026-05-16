export type Monster = {
  id: string;
  name: string;
  exp: number;
  createdAt: string;
  updatedAt: string;
};

export type Feed = {
  id: string;
  sourceMemo: string;
  amount: number;
  createdAt: string;
};

export type GameLog = {
  id: string;
  message: string;
  createdAt: string;
};

export type GameState = {
  monsters: Monster[];
  activeMonsterId: string | null;
  feeds: Feed[];
  logs: GameLog[];
};
