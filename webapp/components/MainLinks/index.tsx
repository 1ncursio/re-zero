import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { DeviceGamepad2, User, Users } from 'tabler-icons-react';

interface MainLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

function MainLink({ icon, label, href }: MainLinkProps) {
  return (
    <Link href={href}>
      <a>
        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            {icon}
            <Text size="sm">{label}</Text>
          </Group>
        </UnstyledButton>
      </a>
    </Link>
  );
}

export function MainLinks() {
  const { t } = useTranslation('navbar');

  const data = useMemo(
    () => [
      { icon: <DeviceGamepad2 size={20} />, label: t('play'), href: '/play' },
      { icon: <Users size={20} />, label: t('community'), href: '/community' },
      { icon: <User size={20} />, label: t('my-games'), href: '/games' },
      //   { icon: <Messages size={16} />, color: 'violet', label: 'Discussions' },
      //   { icon: <Database size={16} />, color: 'grape', label: 'Databases' },
    ],
    [t],
  );

  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
