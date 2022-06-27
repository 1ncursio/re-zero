import { Stack, Text, ThemeIcon, Title, UnstyledButton } from '@mantine/core';
import { useModals } from '@mantine/modals';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { Cpu, Network } from 'tabler-icons-react';

const PlayPage = () => {
  const modals = useModals();

  const openReadyModal = () => {
    modals.openModal({
      title: '준비 중',
      children: <Text size="sm">준비 중입니다.</Text>,
    });
  };

  return (
    <>
      <Head>
        <title>플레이 - Re:zero</title>
      </Head>
      <Title order={1} align="center">
        리버시 플레이
      </Title>
      <div className="my-28 flex gap-16 justify-center text-lg">
        <Link href="/play/computer">
          <UnstyledButton component="a">
            <Stack align="center">
              <ThemeIcon variant="outline" size="xl" radius="xl">
                <Cpu />
              </ThemeIcon>
              <Text>컴퓨터</Text>
            </Stack>
          </UnstyledButton>
        </Link>

        <UnstyledButton type="button" onClick={openReadyModal} className="opacity-30 cursor-not-allowed">
          <Stack align="center">
            <ThemeIcon variant="outline" size="xl" radius="xl">
              <Network />
            </ThemeIcon>
            <Text>온라인</Text>
          </Stack>
        </UnstyledButton>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const initialLocale = locale || 'ko';

  return {
    props: {
      ...(await serverSideTranslations(initialLocale, ['common', 'navbar'])),
    },
  };
};

export default PlayPage;
