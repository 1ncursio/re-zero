import { throttle } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @ts-ignore
import blop from '../../assets/audios/blop.mp3';
import AIHistory from '../../components/AIHistory';
import Icon from '../../components/Icon';
import RequireLogIn from '../../components/RequireLogin/RequireLogin';
import useAIHistoriesSWR from '../../hooks/swr/useAIHistoriesSWR';
import useUsersAIHistoriesSWR from '../../hooks/swr/useUsersAIHistoriesSWR';
import useUserSWR from '../../hooks/swr/useUserSWR';
import createAIHistory from '../../lib/api/othello/createAIHistory';
import requestNextState, { TState } from '../../lib/api/othello/requestNextState';
import Background from '../../lib/othello/Background';
import Canvas from '../../lib/othello/Canvas';
import Indicator from '../../lib/othello/Indicator';
import LastAction from '../../lib/othello/LastAction';
import Piece from '../../lib/othello/Piece';
import Reversi from '../../lib/othello/Reversi';
import { CELL_COUNT, CELL_SIZE, TOTAL_CELL_COUNT } from '../../lib/othelloConfig';

const OthelloAlphaZero = () => {
  const [piecesCount, setPiecesCount] = useState<number>(0);
  const [enemyPiecesCount, setEnemyPiecesCount] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isLoss, setIsLoss] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const gameRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);

  const requestRef = useRef<number | null>(null);
  const reversiRef = useRef<Reversi | null>(null);

  const bgCanvas = useRef<Canvas | null>(null);
  const gameCanvas = useRef<Canvas | null>(null);

  const { data: userData, isLoading: isLoadingUserData } = useUserSWR();
  const { mutate: mutateAIHistories } = useAIHistoriesSWR();
  const { mutate: mutateUsersAIHistories } = useUsersAIHistoriesSWR();

  function render() {
    if (!reversiRef.current || !bgCanvas.current || !gameCanvas.current) return;

    bgCanvas.current.draw();
    gameCanvas.current.draw();

    bgCanvas.current.update(reversiRef.current);
    gameCanvas.current.update(reversiRef.current);

    requestRef.current = requestAnimationFrame(render);
  }

  const onRestart = useCallback(() => {
    if (!reversiRef.current) return;

    reversiRef.current = new Reversi();
    setPiecesCount(2);
    setEnemyPiecesCount(2);
    setIsDone(false);
    setIsDraw(false);
    setIsLoss(false);
  }, [reversiRef, setPiecesCount, setEnemyPiecesCount, setIsDone, setIsDraw, setIsLoss]);

  const onMouseUp = useCallback(
    async (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!gameCanvas.current || !reversiRef.current || !userData) return;

      if (reversiRef.current.isDone() || !reversiRef.current.isFirstPlayer()) {
        console.log('forbidden to play');
        return;
      }

      const { left, top } = gameCanvas.current.canvas.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      let action = Math.floor(x / CELL_SIZE) + Math.floor(y / CELL_SIZE) * CELL_COUNT;
      if (action >= TOTAL_CELL_COUNT || action < 0) return;

      while (true) {
        const legalActions = reversiRef.current.legalActions();
        if (legalActions[0] === TOTAL_CELL_COUNT) {
          action = TOTAL_CELL_COUNT;
        }

        if (action !== TOTAL_CELL_COUNT && !legalActions.includes(action)) {
          return;
        }

        reversiRef.current = reversiRef.current.next(action);
        console.log(reversiRef.current.historiesToNotation());
        new Audio(blop).play();

        setPiecesCount(reversiRef.current.piecesCount(reversiRef.current.enemyPieces));
        setEnemyPiecesCount(reversiRef.current.piecesCount(reversiRef.current.pieces));

        if (reversiRef.current.isDone()) {
          setIsDone(true);
          setIsDraw(reversiRef.current.isDraw());
          setIsLoss(!reversiRef.current.isLoss());

          if (reversiRef.current.isDraw()) {
            const history = await createAIHistory({
              blackId: userData.id,
              whiteId: null,
              status: 'draw',
            });
            mutateAIHistories();
            mutateUsersAIHistories();
          } else if (reversiRef.current.isLoss()) {
            const history = await createAIHistory({
              blackId: userData.id,
              whiteId: null,
              status: 'black_win',
            });
            mutateAIHistories();
            mutateUsersAIHistories();
          } else if (!reversiRef.current.isLoss()) {
            const history = await createAIHistory({
              blackId: userData.id,
              whiteId: null,
              status: 'white_win',
            });
            mutateAIHistories();
            mutateUsersAIHistories();
          }
          return;
        }

        setIsCalculating(true);
        const {
          is_done,
          is_draw,
          is_loss,
          pass_end,
          action: _action,
        }: TState = await requestNextState({
          pieces: reversiRef.current.pieces,
          enemyPieces: reversiRef.current.enemyPieces,
          depth: reversiRef.current.depth,
        });
        setIsCalculating(false);

        reversiRef.current = reversiRef.current.next(_action);
        new Audio(blop).play();
        console.log(reversiRef.current.historiesToNotation());
        setPiecesCount(reversiRef.current.piecesCount(reversiRef.current.pieces));
        setEnemyPiecesCount(reversiRef.current.piecesCount(reversiRef.current.enemyPieces));

        reversiRef.current.setPassEnd(pass_end);
        if (reversiRef.current.legalActions()[0] !== 36 || is_done) {
          if (is_done) {
            setIsDone(true);
            console.log('is done');
          }

          if (is_done && is_draw) {
            setIsDraw(true);
            console.log('is draw');
            await createAIHistory({
              blackId: userData?.id,
              whiteId: null,
              status: 'draw',
            });
            mutateAIHistories();
            mutateUsersAIHistories();
          } else if (is_done && is_loss) {
            setIsLoss(true);
            console.log('is loss');
            await createAIHistory({
              blackId: userData?.id,
              whiteId: null,
              status: 'white_win',
            });
            mutateAIHistories();
            mutateUsersAIHistories();
          } else if (is_done && !is_loss && !is_draw) {
            setIsLoss(false);
            console.log('is win');
            await createAIHistory({
              blackId: userData?.id,
              whiteId: null,
              status: 'black_win',
            });
            mutateAIHistories();
            mutateUsersAIHistories();
          }

          break;
        }
      }
    },
    [
      gameCanvas,
      reversiRef,
      setPiecesCount,
      setEnemyPiecesCount,
      userData,
      mutateAIHistories,
      mutateUsersAIHistories,
    ],
  );

  const onMouseMove = useCallback(
    throttle((e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!gameCanvas.current || !reversiRef.current || !userData) return;

      const { left, top } = gameCanvas.current.canvas.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      gameCanvas.current.mouseX = x;
      gameCanvas.current.mouseY = y;
    }, 20),
    [gameCanvas, reversiRef, userData],
  );

  const onMouseLeave = useCallback(() => {
    if (!gameCanvas.current || !reversiRef.current || !userData) return;

    gameCanvas.current.mouseX = -1;
    gameCanvas.current.mouseY = -1;
  }, [gameCanvas, reversiRef, userData]);

  useEffect(() => {
    if (!gameRef.current || !bgRef.current) return;
    reversiRef.current = new Reversi();

    bgCanvas.current = new Canvas(bgRef.current);
    gameCanvas.current = new Canvas(gameRef.current);

    setPiecesCount(reversiRef.current.piecesCount(reversiRef.current.pieces));
    setEnemyPiecesCount(reversiRef.current.piecesCount(reversiRef.current.enemyPieces));

    // game objects init
    const lastAction = new LastAction(gameCanvas.current.context);
    const indicators = new Array(TOTAL_CELL_COUNT)
      .fill(null)
      .map((_, i) => new Indicator((gameCanvas.current as Canvas).context, i));
    const pieces = new Array(TOTAL_CELL_COUNT)
      .fill(null)
      .map((_, i) => new Piece((gameCanvas.current as Canvas).context, i));

    gameCanvas.current.addCanvasObjects([...indicators, ...pieces, lastAction]);

    // background objects init
    const background = new Background(bgCanvas.current.context);

    bgCanvas.current.addCanvasObjects([background]);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current as number);
  }, []);

  const coloredPiecesCount = (x: number, y: number) => (
    <span className={x > y ? 'text-emerald-500' : ''}>{x}</span>
  );

  if (!userData && !isLoadingUserData) {
    return <RequireLogIn />;
  }

  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4 flex flex-col gap-4 items-center">
      <Helmet>
        <title>알파제로 | Lathello</title>
      </Helmet>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#404040] border border-blueGray-600 rounded-full" />
              <span className="text-sm text-blueGray-600">{userData?.name ?? 'GUEST'}</span>
              <span className="text-lg text-blueGray-600 font-bold">
                {coloredPiecesCount(piecesCount, enemyPiecesCount)}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-row-reverse">
              <div className="w-8 h-8 bg-white border border-blueGray-600 rounded-full" />
              <span className="text-sm text-blueGray-600">알파제로</span>
              <span className="text-lg text-blueGray-600 font-bold">
                {coloredPiecesCount(enemyPiecesCount, piecesCount)}
              </span>
            </div>
          </div>
          <div className="relative w-[calc(480px+32px)] h-[calc(480px+32px)]">
            {isCalculating && (
              <div className="absolute text-white top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                <Icon
                  name="loading"
                  className="animate-spin h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                />
              </div>
            )}
            {isDone && (
              <div className="absolute top-0 left-0 bg-black w-full h-full bg-opacity-30 backdrop-filter backdrop-blur-sm flex justify-center items-center z-40">
                <div className="flex flex-col gap-8 items-center">
                  {isDone && isLoss && (
                    <div className="text-3xl text-white cursor-default user-select-none">아깝네요!</div>
                  )}
                  {isDone && !isLoss && !isDraw && (
                    <div className="text-3xl text-white cursor-default user-select-none">이기셨네요!</div>
                  )}
                  {isDone && isDraw && (
                    <div className="text-3xl text-white cursor-default user-select-none">무승부에요!</div>
                  )}
                  <button
                    type="button"
                    onClick={onRestart}
                    className="text-lg border border-white hover:border-emerald-300 text-white hover:text-emerald-300 py-3 px-8 transition duration-200"
                  >
                    다시 시작
                  </button>
                </div>
              </div>
            )}
            <canvas ref={bgRef} className="w-full h-full absolute z-10" />
            <canvas
              ref={gameRef}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              className="w-[480px] h-[480px] absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
            />
          </div>
        </div>
        <AIHistory />
      </div>
    </div>
  );
};

export default OthelloAlphaZero;
