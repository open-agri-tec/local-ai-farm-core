import { FormEvent, useState } from 'react';

type FeedCreatorProps = {
  onCreateFeed: (memo: string) => void;
};

export const FeedCreator = ({ onCreateFeed }: FeedCreatorProps) => {
  const [memo, setMemo] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreateFeed(memo);
    setMemo('');
  };

  return (
    <section>
      <h2>メモからエサ作成</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          aria-label="農業メモ"
          value={memo}
          onChange={(event: any) => setMemo(event.target.value)}
          placeholder="例: トマトに水やり、葉の状態を確認"
          rows={4}
        />
        <button type="submit">エサにする</button>
      </form>
    </section>
  );
};
