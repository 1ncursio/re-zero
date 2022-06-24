import AIHistory from '@components/AIHistory';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function GamesPage() {
  return <AIHistory />;
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const initialLocale = locale || 'ko';

  return {
    props: {
      ...(await serverSideTranslations(initialLocale, ['common', 'navbar'])),
    },
  };
};
