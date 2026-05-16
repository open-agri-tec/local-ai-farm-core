import { EggCreator } from '../components/EggCreator';
import { FeedCreator } from '../components/FeedCreator';
import { FeedList } from '../components/FeedList';
import { GameControls } from '../components/GameControls';
import { LogList } from '../components/LogList';
import { MonsterList } from '../components/MonsterList';
import { useGameStore } from '../store/gameStore';
import { STORAGE_KEY } from '../utils/storage';

export const GamePage = () => {
  const game = useGameStore();

  return (
    <main>
      <h1>local-ai-farm-core</h1>
      <p>農業記録メモをエサ化して、選択中のモンスターに与える最小コアです。</p>
      <p>localStorageキー: <code>{STORAGE_KEY}</code></p>

      <EggCreator onCreateEgg={game.createEgg} />
      <MonsterList
        monsters={game.state.monsters}
        activeMonsterId={game.state.activeMonsterId}
        onSwitchMonster={game.switchActiveMonster}
      />
      <FeedCreator onCreateFeed={game.createFeedFromMemo} />
      <FeedList feeds={game.state.feeds} activeMonster={game.activeMonster} onFeed={game.feedActiveMonster} />
      <GameControls onExportJson={game.exportJson} onReset={game.resetGame} />
      <LogList logs={game.state.logs} />
    </main>
  );
};
