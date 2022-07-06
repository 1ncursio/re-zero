import useUserSWR from '@hooks/swr/useUserSWR';
import useLogout from '@hooks/useLogout';
import optimizeImage from '@lib/optimizeImage';
import { Avatar, Box, Group, Menu, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { ChevronRight, Login, Logout, Settings } from 'tabler-icons-react';

type LabelItem = {
  type: 'label';
  label: string;
};

type LinkItem = {
  type: 'link' | 'outer_link';
  label: string;
  href: string;
  icon?: React.ReactNode;
};

type ButtonItem = {
  type: 'item';
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
};

type MenuItem = LabelItem | LinkItem | ButtonItem;

export function User() {
  const { t } = useTranslation(['common', 'navbar']);
  const theme = useMantineTheme();
  const { data: userData } = useUserSWR();
  const logout = useLogout();

  const userName = userData?.name ?? t('guest', { ns: 'navbar' });
  const userEmail = userData?.email ?? t('email', { ns: 'common' });

  const authenticatedItems: MenuItem[] = useMemo(
    () => [
      { type: 'label', label: t('application', { ns: 'navbar' }) },
      { type: 'item', icon: <Logout size={14} />, label: t('logout', { ns: 'navbar' }), onClick: logout },
      {
        type: 'link',
        icon: <Settings size={14} />,
        label: t('settings', { ns: 'navbar' }),
        href: '/settings/profile',
      },
    ],
    [t, logout],
  );

  const guestItems: MenuItem[] = useMemo(
    () => [
      {
        type: 'outer_link',
        icon: <Login size={14} />,
        label: t('login', { ns: 'navbar' }),
        href: process.env.NEXT_PUBLIC_AUTH_URL ?? '',
      },
    ],
    [t],
  );

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
              <Avatar src={optimizeImage(userData?.image_url)} radius="xl" />
              <Box sx={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {userName}
                </Text>
                {/* <Text color="dimmed" size="xs">
                  {userEmail}
                </Text> */}
              </Box>

              <ChevronRight size={18} />
            </Group>
          </UnstyledButton>
        </Box>
      }
    >
      {(userData ? authenticatedItems : guestItems).map((item) => {
        switch (item.type) {
          case 'label':
            return <Menu.Label key={item.label}>{item.label}</Menu.Label>;
          case 'link':
            return (
              <Menu.Item icon={item.icon} key={item.label}>
                <Link href={item.href}>
                  <UnstyledButton component="a">{item.label}</UnstyledButton>
                </Link>
              </Menu.Item>
            );
          case 'outer_link':
            return (
              <Menu.Item icon={item.icon} key={item.label}>
                <UnstyledButton component="a" href={item.href}>
                  {item.label}
                </UnstyledButton>
              </Menu.Item>
            );
          case 'item':
            return (
              <Menu.Item icon={item.icon} onClick={item.onClick} key={item.label}>
                {item.label}
              </Menu.Item>
            );
        }
      })}
    </Menu>
  );
}
