import AI from '@components/AI';
import { Button, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { useModals } from '@mantine/modals';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { Cpu, Network } from 'tabler-icons-react';
// import StyledModal from '@components/StyledModal';

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
      <div>
        <div className="mt-10 text-center">
          <Title order={1}>리버시 플레이</Title>
        </div>
        <div className="my-28 flex gap-16 justify-center text-lg">
          <Link href="/play/computer">
            <a>
              <Stack align="center">
                <ThemeIcon variant="outline" size="xl" radius="xl">
                  <Cpu />
                </ThemeIcon>
                <Text>컴퓨터</Text>
              </Stack>
            </a>
          </Link>

          <button type="button" onClick={openReadyModal} className="opacity-30 cursor-not-allowed">
            <Stack align="center">
              <ThemeIcon variant="outline" size="xl" radius="xl">
                <Network />
              </ThemeIcon>
              <Text>온라인</Text>
            </Stack>
          </button>
        </div>
      </div>
      {/* <StyledModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        onRequestOk={closeModal}
        title="준비 중"
        showOkButton
        okText="닫기"
        width="480px"
      >
        준비 중입니다.
      </StyledModal> */}
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
