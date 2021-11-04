import React from 'react';
import PvpMatchingButton from '../../components/PvpMatchingButton';
import PvpRoomList from '../../components/PvpRoomList';
import PvpUserInfoCard from '../../components/PvpUserInfoCard';

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

export default PvpWaitingRoom;
