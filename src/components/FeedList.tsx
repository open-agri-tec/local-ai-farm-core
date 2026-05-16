import type { Feed, Monster } from '../types/game';

type FeedListProps = {
  feeds: Feed[];
  activeMonster: Monster | null;
  onFeed: (feedId: string) => void;
};

export const FeedList = ({ feeds, activeMonster, onFeed }: FeedListProps) => (
  <section>
    <h2>エサ</h2>
    {!activeMonster && <p>エサをあげるにはモンスターを作成してください。</p>}
    {feeds.length === 0 ? (
      <p>エサはありません。</p>
    ) : (
      <ul>
        {feeds.map((feed) => (
          <li key={feed.id}>
            <p>{feed.sourceMemo}</p>
            <button type="button" onClick={() => onFeed(feed.id)} disabled={!activeMonster}>
              {activeMonster ? `${activeMonster.name} にあげる` : 'モンスター未選択'} / EXP +{feed.amount}
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);
