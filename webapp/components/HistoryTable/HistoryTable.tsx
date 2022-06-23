import { Button, Stack } from '@mantine/core';
import useStore from '@store/useStore';
import { Refresh } from 'tabler-icons-react';

type HistoryTableProps = {
  onRestart: () => void;
  isCalculating: boolean;
};

export default function HistoryTable({ onRestart, isCalculating }: HistoryTableProps) {
  const { histories, convertActionToNotation } = useStore((state) => state.reversi);

  return (
    <Stack>
      <div>
        {histories.map((history) => (
          <div
            key={history.action}
            className="text-sm text-blueGray-600 border border-black inline-flex justify-center items-center w-1/2"
          >
            {convertActionToNotation(history.action)}
          </div>
        ))}
      </div>
      <Button variant="outline" leftIcon={<Refresh size={16} />} onClick={onRestart} disabled={isCalculating}>
        다시 시작
      </Button>
    </Stack>
  );
}
