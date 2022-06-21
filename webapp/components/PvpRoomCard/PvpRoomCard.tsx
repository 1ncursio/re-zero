import Link from 'next/link';
import { FC } from 'react';

type PvpRoomCardProps = {
  room: any;
};

const PvpRoomCard: FC<PvpRoomCardProps> = ({ room }) => {
  return (
    <Link href={`/reversi/pvp/${room.uuid}`} className="flex justify-between border-2 rounded-lg p-4">
      <a>
        <div>
          <span>{room.name}</span>
        </div>
        <div className="flex gap-2">
          {room.password && <div>비번있음</div>}
          {room.is_started && <div className="border-2 rounded-md text-sm">게임 중</div>}
          <div>{room.users.length} / 2</div>
        </div>
      </a>
    </Link>
  );
};

export default PvpRoomCard;
