import type { GameLog } from '../types/game';

type LogListProps = {
  logs: GameLog[];
};

export const LogList = ({ logs }: LogListProps) => (
  <section>
    <h2>ログ</h2>
    {logs.length === 0 ? (
      <p>ログはありません。</p>
    ) : (
      <ol>
        {logs.map((log) => (
          <li key={log.id}>
            <time dateTime={log.createdAt}>{new Date(log.createdAt).toLocaleString()}</time> {log.message}
          </li>
        ))}
      </ol>
    )}
  </section>
);
