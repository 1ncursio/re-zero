import { Button, Stack, Text } from '@mantine/core';
import convertActionToNotation from '@store/reversi/convertActionToNotation';
import useStore from '@store/useStore';
import { Refresh } from 'tabler-icons-react';

type PlayControllerProps = {
  onRestart: () => void;
  isCalculating: boolean;
};

export default function PlayController({ onRestart, isCalculating }: PlayControllerProps) {
  const { histories } = useStore((state) => state.reversi);

  return (
    <Stack>
      <div>
        {histories.map((history) => (
          <div
            key={history.action}
            className="border border-black inline-flex justify-center items-center w-1/2"
          >
            <Text size="sm">{convertActionToNotation(history.action)}</Text>
          </div>
        ))}
      </div>
      <Button variant="outline" leftIcon={<Refresh size={16} />} onClick={onRestart} disabled={isCalculating}>
        다시 시작
      </Button>
    </Stack>
  );
}
