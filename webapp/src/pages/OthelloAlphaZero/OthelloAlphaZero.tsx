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
import requestNextState, {
  TState,
} from '../../lib/api/othello/requestNextState';
import Coordinate from '../../lib/othello/Coordinate';
import Grid from '../../lib/othello/Grid';
import Indicator from '../../lib/othello/Indicator';
import LastAction from '../../lib/othello/LastAction';
import Piece from '../../lib/othello/Piece';
import State from '../../lib/othello/State';
import {
  BACKGROUND_COLOR,
  BACKGROUND_CANVAS_SIZE,
  CELL_COUNT,
  CELL_SIZE,
  COORDINATE_SIZE,
  GRID_COLOR,
  GAME_CANVAS_SIZE,
} from '../../lib/othelloConfig';

const OthelloAlphaZero = () => {
  const [piecesCount, setPiecesCount] = useState<number>(0);
  const [enemyPiecesCount, setEnemyPiecesCount] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isLoss, setIsLoss] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const gameRef = useRef<HTMLCanvasElement>(null);
  const gameCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const backgroundRef = useRef<HTMLCanvasElement>(null);
  const backgroundCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const requestRef = useRef<number | null>(null);
  const stateRef = useRef<State | null>(null);
  const lastActionRef = useRef<LastAction | null>(null);

  const { data: userData, isLoading: isLoadingUserData } = useUserSWR();
  const { mutate: mutateAIHistories } = useAIHistoriesSWR();
  const { mutate: mutateUsersAIHistories } = useUsersAIHistoriesSWR();

  const pieces = Array.from(
    { length: CELL_COUNT ** 2 },
    (_, i) => new Piece(i),
  );
  const grid = new Grid();
  const coordinate = new Coordinate();
  const indicators = Array.from(
    { length: CELL_COUNT ** 2 },
    (_, i) => new Indicator(i),
  );

  function render() {
    if (
      !gameRef.current ||
      !gameCtxRef.current ||
      !stateRef.current ||
      !backgroundCtxRef.current ||
      !lastActionRef.current
    )
      return;

    requestRef.current = window.requestAnimationFrame(render);

    gameCtxRef.current.clearRect(
      0,
      0,
      BACKGROUND_CANVAS_SIZE,
      BACKGROUND_CANVAS_SIZE,
    );

    const isFirstPlayer = stateRef.current.isFirstPlayer();
    stateRef.current.pieces.forEach((v, i) => {
      if (v === 1) {
        pieces[i]
          .setIsblack(isFirstPlayer)
          .draw(gameCtxRef.current as CanvasRenderingContext2D);
      }
    });
    stateRef.current.enemyPieces.forEach((v, i) => {
      if (v === 1) {
        pieces[i]
          .setIsblack(!isFirstPlayer)
          .draw(gameCtxRef.current as CanvasRenderingContext2D);
      }
    });
    if (isFirstPlayer && !stateRef.current.isDone()) {
      stateRef.current
        .legalActions()
        .forEach(
          (v) =>
            v !== CELL_COUNT ** 2 &&
            indicators[v]?.draw(gameCtxRef.current as CanvasRenderingContext2D),
        );
    }
    lastActionRef.current.draw(gameCtxRef.current as CanvasRenderingContext2D);
  }

  const onRestart = useCallback(() => {
    if (!stateRef.current) return;

    stateRef.current = new State();
    setPiecesCount(2);
    setEnemyPiecesCount(2);
    setIsDone(false);
    setIsDraw(false);
    setIsLoss(false);
  }, [
    stateRef,
    setPiecesCount,
    setEnemyPiecesCount,
    setIsDone,
    setIsDraw,
    setIsLoss,
  ]);

  const onMouseUp = useCallback(
    async (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (
        !gameRef.current ||
        !gameCtxRef.current ||
        !stateRef.current ||
        !lastActionRef.current ||
        !userData
      )
        return;

      if (stateRef.current.isDone()) {
        console.log('is Done');
        return;
      }

      if (!stateRef.current.isFirstPlayer()) {
        console.log('is not first player');
        return;
      }

      const { left, top } = gameRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      let action =
        Math.floor(x / CELL_SIZE) + Math.floor(y / CELL_SIZE) * CELL_COUNT;
      if (action >= CELL_COUNT ** 2 || action < 0) return;

      while (true) {
        const legalActions = stateRef.current.legalActions();
        if (legalActions[0] === CELL_COUNT ** 2) {
          action = CELL_COUNT ** 2;
        }

        if (action !== CELL_COUNT ** 2 && !legalActions.includes(action)) {
          return;
        }

        stateRef.current = stateRef.current.next(action);
        lastActionRef.current.setIndex(action);
        console.log(stateRef.current.historiesToNotation());
        new Audio(blop).play();

        setPiecesCount(
          stateRef.current.piecesCount(stateRef.current.enemyPieces),
        );
        setEnemyPiecesCount(
          stateRef.current.piecesCount(stateRef.current.pieces),
        );

        if (stateRef.current.isDone()) {
          setIsDone(true);
          setIsDraw(stateRef.current.isDraw());
          setIsLoss(!stateRef.current.isLoss());

          if (stateRef.current.isDraw()) {
            const history = await createAIHistory({
              blackId: userData.id,
              whiteId: null,
              status: 'draw',
            });
            mutateAIHistories();
            mutateUsersAIHistories();
          } else if (stateRef.current.isLoss()) {
            const history = await createAIHistory({
              blackId: userData.id,
              whiteId: null,
              status: 'black_win',
            });
            mutateAIHistories();
            mutateUsersAIHistories();
          } else if (!stateRef.current.isLoss()) {
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
          pieces: stateRef.current.pieces,
          enemyPieces: stateRef.current.enemyPieces,
          depth: stateRef.current.depth,
        });
        setIsCalculating(false);

        stateRef.current = stateRef.current.next(_action);
        new Audio(blop).play();
        lastActionRef.current.setIndex(_action);
        console.log(stateRef.current.historiesToNotation());
        setPiecesCount(stateRef.current.piecesCount(stateRef.current.pieces));
        setEnemyPiecesCount(
          stateRef.current.piecesCount(stateRef.current.enemyPieces),
        );

        stateRef.current.setPassEnd(pass_end);
        if (stateRef.current.legalActions()[0] !== 36 || is_done) {
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
      gameRef,
      gameCtxRef,
      stateRef,
      lastActionRef,
      setPiecesCount,
      setEnemyPiecesCount,
      userData,
    ],
  );

  useEffect(() => {
    if (!gameRef.current || !backgroundRef.current) return;
    stateRef.current = new State();
    lastActionRef.current = new LastAction();
    setPiecesCount(stateRef.current.piecesCount(stateRef.current.pieces));
    setEnemyPiecesCount(
      stateRef.current.piecesCount(stateRef.current.enemyPieces),
    );

    gameCtxRef.current = gameRef.current.getContext('2d');
    backgroundCtxRef.current = backgroundRef.current.getContext('2d');
    if (!backgroundCtxRef.current) return;
    backgroundCtxRef.current.clearRect(
      0,
      0,
      BACKGROUND_CANVAS_SIZE,
      BACKGROUND_CANVAS_SIZE,
    );
    backgroundCtxRef.current.fillStyle = GRID_COLOR;
    backgroundCtxRef.current.fillRect(
      0,
      0,
      BACKGROUND_CANVAS_SIZE,
      BACKGROUND_CANVAS_SIZE,
    );
    backgroundCtxRef.current.fillStyle = BACKGROUND_COLOR;
    backgroundCtxRef.current.fillRect(
      COORDINATE_SIZE,
      COORDINATE_SIZE,
      GAME_CANVAS_SIZE,
      GAME_CANVAS_SIZE,
    );
    grid.draw(backgroundCtxRef.current);
    coordinate.draw(backgroundCtxRef.current);
  }, [gameRef, stateRef, backgroundRef]);

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
              <span className="text-sm text-blueGray-600">
                {userData?.name ?? 'GUEST'}
              </span>
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
                    <div className="text-3xl text-white cursor-default user-select-none">
                      아깝네요!
                    </div>
                  )}
                  {isDone && !isLoss && !isDraw && (
                    <div className="text-3xl text-white cursor-default user-select-none">
                      이기셨네요!
                    </div>
                  )}
                  {isDone && isDraw && (
                    <div className="text-3xl text-white cursor-default user-select-none">
                      무승부에요!
                    </div>
                  )}
                  <button
                    onClick={onRestart}
                    className="text-lg border border-white hover:border-emerald-300 text-white hover:text-emerald-300 py-3 px-8 transition duration-200"
                  >
                    다시 시작
                  </button>
                </div>
              </div>
            )}
            <canvas
              ref={backgroundRef}
              width={BACKGROUND_CANVAS_SIZE}
              height={BACKGROUND_CANVAS_SIZE}
              className="w-full h-full absolute z-10"
            />
            <canvas
              ref={gameRef}
              onMouseUp={onMouseUp}
              width={GAME_CANVAS_SIZE}
              height={GAME_CANVAS_SIZE}
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
