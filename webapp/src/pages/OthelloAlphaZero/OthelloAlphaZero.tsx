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
import BackgroundObject from '../../lib/othello/BackgroundObject';
import Canvas from '../../lib/othello/Canvas';
import Coordinate from '../../lib/othello/Coordinate';
import GameObject from '../../lib/othello/GameObject';
import Grid from '../../lib/othello/Grid';
import Indicator from '../../lib/othello/Indicator';
import LastAction from '../../lib/othello/LastAction';
import Piece from '../../lib/othello/Piece';
import Reversi from '../../lib/othello/Reversi';
import {
  BACKGROUND_CANVAS_SIZE,
  BACKGROUND_COLOR,
  CELL_COUNT,
  CELL_SIZE,
  COORDINATE_COLOR,
  COORDINATE_SIZE,
  GAME_CANVAS_SIZE,
  TOTAL_CELL_COUNT,
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
  const stateRef = useRef<Reversi | null>(null);
  const gameObjectsRef = useRef<GameObject[]>([]);
  const backgroundObjectsRef = useRef<BackgroundObject[]>([]);

  let canvas = useRef<Canvas | null>(null);

  const { data: userData, isLoading: isLoadingUserData } = useUserSWR();
  const { mutate: mutateAIHistories } = useAIHistoriesSWR();
  const { mutate: mutateUsersAIHistories } = useUsersAIHistoriesSWR();

  function render() {
    if (
      !gameRef.current ||
      !gameCtxRef.current ||
      !stateRef.current ||
      !backgroundCtxRef.current
    )
      return;

    gameCtxRef.current.clearRect(
      0,
      0,
      BACKGROUND_CANVAS_SIZE,
      BACKGROUND_CANVAS_SIZE,
    );

    gameObjectsRef.current.forEach((obj) => obj.draw());

    gameObjectsRef.current.forEach((obj) =>
      obj.update(stateRef.current as Reversi),
    );

    // Draw number to the screen
    backgroundCtxRef.current.clearRect(
      0,
      0,
      BACKGROUND_CANVAS_SIZE,
      BACKGROUND_CANVAS_SIZE,
    );
    backgroundCtxRef.current.fillStyle = COORDINATE_COLOR;
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
    backgroundObjectsRef.current.forEach((obj) => obj.draw());

    requestRef.current = requestAnimationFrame(render);
  }

  const onRestart = useCallback(() => {
    if (!stateRef.current) return;

    stateRef.current = new Reversi();
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
      if (action >= TOTAL_CELL_COUNT || action < 0) return;

      while (true) {
        const legalActions = stateRef.current.legalActions();
        if (legalActions[0] === TOTAL_CELL_COUNT) {
          action = TOTAL_CELL_COUNT;
        }

        if (action !== TOTAL_CELL_COUNT && !legalActions.includes(action)) {
          return;
        }

        stateRef.current = stateRef.current.next(action);
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
      setPiecesCount,
      setEnemyPiecesCount,
      userData,
    ],
  );

  useEffect(() => {
    if (!gameRef.current || !backgroundRef.current) return;
    stateRef.current = new Reversi();

    gameCtxRef.current = gameRef.current.getContext('2d');
    backgroundCtxRef.current = backgroundRef.current.getContext('2d');
    if (!backgroundCtxRef.current || !gameCtxRef.current) return;

    canvas.current = new Canvas(backgroundRef.current);

    // const bgRect = backgroundRef.current.getBoundingClientRect();
    const gameRect = gameRef.current.getBoundingClientRect();

    // const bgWidth =
    //   Math.round(devicePixelRatio * bgRect.right) -
    //   Math.round(devicePixelRatio * bgRect.left);
    // const bgHeight =
    //   Math.round(devicePixelRatio * bgRect.bottom) -
    //   Math.round(devicePixelRatio * bgRect.top);

    const gameWidth =
      Math.round(devicePixelRatio * gameRect.right) -
      Math.round(devicePixelRatio * gameRect.left);
    const gameHeight =
      Math.round(devicePixelRatio * gameRect.bottom) -
      Math.round(devicePixelRatio * gameRect.top);

    // backgroundRef.current.width = bgWidth;
    // backgroundRef.current.height = bgHeight;

    gameRef.current.width = gameWidth;
    gameRef.current.height = gameHeight;

    // backgroundCtxRef.current.scale(devicePixelRatio, devicePixelRatio);
    gameCtxRef.current.scale(devicePixelRatio, devicePixelRatio);

    setPiecesCount(stateRef.current.piecesCount(stateRef.current.pieces));
    setEnemyPiecesCount(
      stateRef.current.piecesCount(stateRef.current.enemyPieces),
    );

    // game objects init
    const lastAction = new LastAction(gameCtxRef.current);
    const indicators = new Array(TOTAL_CELL_COUNT)
      .fill(null)
      .map(
        (_, i) =>
          new Indicator(gameCtxRef.current as CanvasRenderingContext2D, i),
      );
    const pieces = new Array(TOTAL_CELL_COUNT)
      .fill(null)
      .map(
        (_, i) => new Piece(gameCtxRef.current as CanvasRenderingContext2D, i),
      );

    gameObjectsRef.current = [...indicators, ...pieces, lastAction];

    // background objects init
    const coordinate = new Coordinate(backgroundCtxRef.current);
    const grid = new Grid(backgroundCtxRef.current);
    backgroundObjectsRef.current = [coordinate, grid];
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
              className="w-full h-full absolute z-10"
            />
            <canvas
              ref={gameRef}
              onMouseUp={onMouseUp}
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
