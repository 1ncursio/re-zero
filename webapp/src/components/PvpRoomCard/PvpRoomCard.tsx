import React, { FC } from 'react';
import { Link } from 'react-router-dom';

type PvpRoomCardProps = {
  room: any;
};

const PvpRoomCard: FC<PvpRoomCardProps> = ({ room }) => {
  return (
    <Link
      to={`/othello/pvp/${room.uuid}`}
      className="flex justify-between border-2 rounded-lg p-4"
    >
      <div>
        <span>{room.name}</span>
      </div>
      <div className="flex gap-2">
        {room.password && <div>비번있음</div>}
        {room.is_started && (
          <div className="border-2 rounded-md text-sm">게임 중</div>
        )}
        <div>{room.users.length} / 2</div>
      </div>
    </Link>
  );
};

export default PvpRoomCard;
