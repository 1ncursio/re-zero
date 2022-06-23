import PvpMatchingButton from '@components/PvpMatchingButton';
import PvpRoomList from '@components/PvpRoomList';
import PvpUserInfoCard from '@components/PvpUserInfoCard';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const PvpWaitingRoom = () => {
  return (
    <div className="lg:w-xl w-md mx-auto md:w-full md:px-4 h-[calc(100vh-200px)]">
      <div className="flex justify-between h-full">
        <PvpRoomList />
        <div className="flex flex-col justify-between">
          <PvpUserInfoCard />
          <PvpMatchingButton />
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const initialLocale = locale || 'ko';

  return {
    props: {
      ...(await serverSideTranslations(initialLocale, ['common'])),
    },
  };
};

export default PvpWaitingRoom;
