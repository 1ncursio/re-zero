import React from 'react';
import useStore from '../../store/useStore';

const HistoryTable = () => {
  const { histories, convertActionToNotation } = useStore((state) => state.reversi);
  return (
    <div className="flex flex-col gap-2">
      <span>Move</span>
      {histories.map((history) => (
        <span key={history.action} className="text-sm text-blueGray-600">
          {convertActionToNotation(history.action)}
        </span>
      ))}
    </div>
  );
};

export default HistoryTable;
