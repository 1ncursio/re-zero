import { ActionIcon, Box, Button, Group, ScrollArea, Stack, Table } from '@mantine/core';
import convertActionToNotation from '@store/reversi/convertActionToNotation';
import useStore from '@store/useStore';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Refresh } from 'tabler-icons-react';
import shallow from 'zustand/shallow';

type PlayControllerProps = {
  onRestart: () => void;
  isCalculating: boolean;
};

export default function PlayController({ onRestart, isCalculating }: PlayControllerProps) {
  const { t } = useTranslation('common');

  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current?.scrollHeight, behavior: 'smooth' });
  }, []);

  const { histories } = useStore((state) => state.reversi);
  const unsub = useStore.subscribe(
    (state) => state.reversi.histories,
    (h) => setTimeout(scrollToBottom, 100),
    {
      equalityFn: shallow,
    },
  );

  const historiesData = useMemo(() => {
    const result = [];

    // 두 개씩 묶어서 테이블 형태로 보여줌
    for (let i = 0; i < histories.length; i += 2) {
      result.push(
        <tr key={i}>
          <td style={{ width: 50 }}>{`${i / 2 + 1}.`}</td>
          <td align="center">{convertActionToNotation(histories.at(i)?.action)}</td>
          <td align="center">{convertActionToNotation(histories.at(i + 1)?.action)}</td>
        </tr>,
      );
    }

    return result;
  }, [histories]);

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        width: 280,
      })}
    >
      <Stack>
        <ScrollArea style={{ height: 300 }} viewportRef={viewportRef}>
          <Table striped highlightOnHover>
            <tbody>{historiesData}</tbody>
          </Table>
        </ScrollArea>
        <Group grow spacing="xs">
          <ActionIcon variant="outline" size="lg" onClick={() => {}} disabled={isCalculating}>
            <ChevronLeft size={18} />
          </ActionIcon>
          <ActionIcon variant="outline" size="lg" onClick={() => {}} disabled={isCalculating}>
            <ChevronRight size={18} />
          </ActionIcon>
          <ActionIcon variant="outline" size="lg" onClick={onRestart} disabled={isCalculating}>
            <Refresh size={18} />
          </ActionIcon>
        </Group>
      </Stack>
    </Box>
  );
}
