import type { Monster } from '../types/game';

type MonsterListProps = {
  monsters: Monster[];
  activeMonsterId: string | null;
  onSwitchMonster: (monsterId: string) => void;
};

export const MonsterList = ({ monsters, activeMonsterId, onSwitchMonster }: MonsterListProps) => (
  <section>
    <h2>モンスター</h2>
    {monsters.length === 0 ? (
      <p>まだモンスターはいません。</p>
    ) : (
      <ul>
        {monsters.map((monster) => (
          <li key={monster.id}>
            <button
              type="button"
              onClick={() => onSwitchMonster(monster.id)}
              disabled={monster.id === activeMonsterId}
            >
              {monster.id === activeMonsterId ? '選択中: ' : ''}
              {monster.name} / EXP {monster.exp}
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);
