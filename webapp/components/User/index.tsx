import React from 'react';
import { ChevronRight, Login, Logout, Settings } from 'tabler-icons-react';
import { UnstyledButton, Group, Avatar, Text, Box, useMantineTheme, Menu } from '@mantine/core';
import useUserSWR from '@hooks/swr/useUserSWR';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import useLogout from '@hooks/useLogout';

export function UserMenu() {
  const { t } = useTranslation(['common', 'navbar']);
  const theme = useMantineTheme();
  const { data: userData } = useUserSWR();
  const logout = useLogout();

  const userName = userData?.name ?? t('guest', { ns: 'navbar' });
  const userEmail = userData?.email ?? t('email', { ns: 'common' });

  return (
    <Menu
      withArrow
      trigger="hover"
      position="right"
      sx={{
        width: '100%',
      }}
      control={
        <Box
          sx={{
            paddingTop: theme.spacing.sm,
            borderTop: `1px solid ${
              theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
          }}
        >
          <UnstyledButton
            sx={{
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

              '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
              },
            }}
          >
            <Group>
              <Avatar src={userData?.image_url} radius="xl" />
              <Box sx={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {userName}
                </Text>
                <Text color="dimmed" size="xs">
                  {userEmail}
                </Text>
              </Box>

              <ChevronRight size={18} />
            </Group>
          </UnstyledButton>
        </Box>
      }
    >
      <Menu.Label>Application</Menu.Label>
      <Menu.Item icon={<Login size={14} />}>
        <Link href={process.env.NEXT_PUBLIC_AUTH_URL ?? ''}>
          <a>로그인</a>
        </Link>
      </Menu.Item>
      <Menu.Item icon={<Logout size={14} />} onClick={logout}>
        로그아웃
      </Menu.Item>
      <Menu.Item icon={<Settings size={14} />}>
        <Link href="/account/profile">
          <a>설정</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
}
