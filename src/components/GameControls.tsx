type GameControlsProps = {
  onExportJson: () => string;
  onReset: () => void;
};

export const GameControls = ({ onExportJson, onReset }: GameControlsProps) => {
  const handleExport = () => {
    const json = onExportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'local-ai-farm-core-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <h2>管理</h2>
      <button type="button" onClick={handleExport}>
        JSONエクスポート
      </button>
      <button type="button" onClick={onReset}>
        初期化
      </button>
    </section>
  );
};
