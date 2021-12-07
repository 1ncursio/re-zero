import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const OthelloMain = () => {
  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
      <div className="mt-10 text-center">
        <h1 className="text-4xl font-bold text-blueGray-600 mb-4">
          오셀로 게임
        </h1>
        <p className="text-lg text-blueGray-500">
          실시간으로 오셀로 게임을 즐겨보세요!
        </p>
      </div>
      <div className="my-28 flex gap-16 justify-center text-lg">
        <Link to="/othello">
          <div className="flex flex-col justify-center items-center gap-2">
            <Button
              icon="ai"
              onClick={() => {}}
              className="w-32 h-32"
              iconClassName="w-2/3 h-2/3"
            />
            <span>AI 대전</span>
          </div>
        </Link>
        <Link to="/othello/pvp">
          <div className="flex flex-col justify-center items-center gap-2">
            <Button
              icon="pvp"
              onClick={() => {}}
              className="w-32 h-32"
              iconClassName="w-full h-full"
            />
            <span>PVP</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default OthelloMain;
