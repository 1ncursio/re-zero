import useStore from '@store/useStore';

const HistoryTable = () => {
  const { histories, convertActionToNotation } = useStore((state) => state.reversi);
  return (
    <section className="flex flex-col gap-2 w-32">
      <div className="inline-flex justify-center items-center">MOVES</div>
      <div>
        {histories.map((history) => (
          <div
            key={history.action}
            className="text-sm text-blueGray-600 border border-black inline-flex justify-center items-center w-1/2"
          >
            {convertActionToNotation(history.action)}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HistoryTable;
