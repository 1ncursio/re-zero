import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  CSSObject,
  Group,
  MantineTheme,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import convertActionToNotation from '@store/reversi/convertActionToNotation';
import useStore from '@store/useStore';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Refresh, Settings } from 'tabler-icons-react';
import shallow from 'zustand/shallow';
import theme, { ThemeName } from '~/config/theme';

const controlButtonStyles = (theme: MantineTheme): CSSObject => ({
  '&:hover': {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[0],
  },
});

type PlayControllerProps = {
  onRestart: () => void;
  onChangeTheme: (value: ThemeName) => void;
  isCalculating: boolean;
};

export default function PlayController({ onRestart, onChangeTheme, isCalculating }: PlayControllerProps) {
  const { t } = useTranslation('common');

  // 모달 관련
  const themeNames = Object.keys(theme);
  const [selectedTheme, setSelectedTheme] = useState(themeNames[0]);
  const [checkedSoundOn, setCheckedSoundOn] = useState(true);
  const [openedSettingModal, setOpenedSettingModal] = useState(false);

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
        <tr key={i} style={{}}>
          <td align="center" style={{ verticalAlign: 'bottom' }}>{`${i / 2 + 1}.`}</td>
          <td align="center" style={{ verticalAlign: 'bottom' }}>
            <Text weight={500}>{convertActionToNotation(histories.at(i)?.action)}</Text>
          </td>
          <td align="center" style={{ verticalAlign: 'bottom' }}>
            <Text weight={500}>{convertActionToNotation(histories.at(i + 1)?.action)}</Text>
          </td>
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
      <Stack justify="space-between" sx={{ height: '100%' }}>
        <ScrollArea style={{ height: 300 }} viewportRef={viewportRef}>
          <Table striped>
            <tbody>{historiesData}</tbody>
          </Table>
        </ScrollArea>
        <Group grow spacing="xs" position="right">
          <ActionIcon
            variant="hover"
            size="xl"
            onClick={() => setOpenedSettingModal(true)}
            sx={controlButtonStyles}
          >
            <Settings size={18} />
          </ActionIcon>
          <ActionIcon
            variant="hover"
            size="xl"
            // onClick={() => {}}
            disabled={isCalculating}
            sx={controlButtonStyles}
          >
            <ChevronLeft size={18} />
          </ActionIcon>
          <ActionIcon
            variant="hover"
            size="xl"
            // onClick={() => {}}
            disabled={isCalculating}
            sx={controlButtonStyles}
          >
            <ChevronRight size={18} />
          </ActionIcon>
          <ActionIcon
            variant="hover"
            size="xl"
            onClick={onRestart}
            disabled={isCalculating}
            sx={controlButtonStyles}
          >
            <Refresh size={16} />
          </ActionIcon>
        </Group>
      </Stack>
      <Modal
        opened={openedSettingModal}
        centered
        onClose={() => setOpenedSettingModal(false)}
        title="게임 설정"
      >
        <Stack>
          <Select
            label="테마"
            value={selectedTheme}
            data={themeNames}
            onChange={(value) => {
              if (!value) return setSelectedTheme(themeNames[0]);
              setSelectedTheme(value);
              onChangeTheme(value as ThemeName);
            }}
          />
          <Checkbox
            label="소리 재생"
            checked={checkedSoundOn}
            onChange={(e) => setCheckedSoundOn(e.currentTarget.checked)}
          />
          <Group position="right">
            <Button variant="default" onClick={() => setOpenedSettingModal(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                setOpenedSettingModal(false);
                showNotification({
                  title: '설정 저장 완료',
                  message: '설정이 저장되었습니다.',
                  color: 'blue',
                  icon: <Check size={16} />,
                });
              }}
            >
              저장
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
