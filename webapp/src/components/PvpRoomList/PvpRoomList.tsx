import React, { useState } from 'react';
import { Room } from '../../typings/room';
import PvpRoomCard from '../PvpRoomCard';

const PvpRoomList = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      uuid: '9d588dcd-88e0-46b2-81c2-10f32cfd3834',
      name: '초보만',
      users: [
        {
          id: 1,
        },
        { id: 2 },
      ],
      is_started: false,
      password: null,
    },
    {
      id: 2,
      uuid: '7a19809c-36eb-4d4d-a20c-319118693626',
      name: '즐거운 오셀로 해요~',
      users: [
        {
          id: 1,
        },
        { id: 2 },
      ],
      is_started: true,
      password: 'password',
    },
    {
      id: 3,
      uuid: 'f8f361b3-2394-43bb-a807-96f701144c15',
      name: '오삭빵 ㄱㄱ',
      users: [{ id: 2 }],
      is_started: false,
      password: null,
    },
    {
      id: 4,
      uuid: '5c657512-fee0-4e01-8295-20abd7518dec',
      name: 'ㅇㅅㅇ',
      users: [
        {
          id: 1,
        },
      ],
      is_started: false,
      password: null,
    },
  ]);

  return (
    <div className="w-sm border-2 rounded-lg p-2 flex flex-col gap-2">
      {rooms.map((room) => (
        <PvpRoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default PvpRoomList;
