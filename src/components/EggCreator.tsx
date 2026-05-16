import { FormEvent, useState } from 'react';

type EggCreatorProps = {
  onCreateEgg: (name: string) => void;
};

export const EggCreator = ({ onCreateEgg }: EggCreatorProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreateEgg(name);
    setName('');
  };

  return (
    <section>
      <h2>タマゴ作成</h2>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="モンスター名"
          value={name}
          onChange={(event: any) => setName(event.target.value)}
          placeholder="モンスター名（空でも可）"
        />
        <button type="submit">タマゴを作る</button>
      </form>
    </section>
  );
};
