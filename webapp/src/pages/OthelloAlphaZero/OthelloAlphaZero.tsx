import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/Icon';
import useUserSWR from '../../hooks/swr/useUserSWR';
import requestNextState, {
  TState,
} from '../../lib/api/othello/requestNextState';
import Grid from '../../lib/othello/Grid';
import Indicator from '../../lib/othello/Indicator';
import Piece from '../../lib/othello/Piece';
import State from '../../lib/othello/State';
import {
  CELL_COUNT,
  CANVAS_SIZE,
  BACKGROUND_COLOR,
  CELL_SIZE,
} from '../../lib/othelloConfig';

const OthelloAlphaZero = () => {
  const [piecesCount, setPiecesCount] = useState<number>(0);
  const [enemyPiecesCount, setEnemyPiecesCount] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isLoss, setIsLoss] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const requestRef = useRef<number>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const stateRef = useRef<State>(null);

  const { data: userData } = useUserSWR();

  const pieces = Array.from(
    { length: CELL_COUNT ** 2 },
    (_, i) => new Piece(i),
  );
  const grid = new Grid();
  const indicators = Array.from(
    { length: CELL_COUNT ** 2 },
    (_, i) => new Indicator(i),
  );

  function render() {
    if (!canvasRef.current || !contextRef.current || !stateRef.current) return;

    // @ts-ignore
    requestRef.current = window.requestAnimationFrame(render);
    contextRef.current.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    contextRef.current.fillStyle = BACKGROUND_COLOR;
    contextRef.current.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    grid.draw(contextRef.current);

    const isFirstPlayer = stateRef.current.isFirstPlayer();
    stateRef.current.pieces.forEach((v, i) => {
      if (v === 1) {
        pieces[i]
          .setIsblack(isFirstPlayer)
          .draw(contextRef.current as CanvasRenderingContext2D);
      }
    });
    stateRef.current.enemyPieces.forEach((v, i) => {
      if (v === 1) {
        pieces[i]
          .setIsblack(!isFirstPlayer)
          .draw(contextRef.current as CanvasRenderingContext2D);
      }
    });
    if (isFirstPlayer && !stateRef.current.isDone()) {
      stateRef.current
        .legalActions()
        .forEach(
          (v) =>
            v !== CELL_COUNT ** 2 &&
            indicators[v]?.draw(contextRef.current as CanvasRenderingContext2D),
        );
    }
  }

  const onRestart = useCallback(() => {
    if (!stateRef.current) return;

    // @ts-ignore
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

  const onMouseDown = useCallback(
    async (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !contextRef.current || !stateRef.current)
        return;

      if (stateRef.current.isDone()) {
        console.log('is Done');
        // @ts-ignore
        return;
      }

      if (!stateRef.current.isFirstPlayer()) {
        console.log('is not first player');
        return;
      }

      const { left, top } = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      let action =
        Math.floor(x / CELL_SIZE) + Math.floor(y / CELL_SIZE) * CELL_COUNT;

      while (true) {
        const legalActions = stateRef.current.legalActions();
        if (legalActions[0] === CELL_COUNT ** 2) {
          action = CELL_COUNT ** 2;
        }

        if (action !== CELL_COUNT ** 2 && !legalActions.includes(action)) {
          return;
        }

        // @ts-ignore
        stateRef.current = stateRef.current.next(action);
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
          console.log('여기냐');
          return;
        }

        setIsCalculating(true);
        const {
          pieces,
          enemy_pieces,
          depth,
          is_done,
          is_draw,
          is_loss,
          pass_end,
        }: TState = await requestNextState({
          pieces: stateRef.current.pieces,
          enemyPieces: stateRef.current.enemyPieces,
          depth: stateRef.current.depth,
        });
        setIsCalculating(false);

        // @ts-ignore
        stateRef.current = new State(pieces, enemy_pieces, depth);
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
          } else if (is_done && is_loss) {
            setIsLoss(true);
            console.log('is loss');
          }
          // if (is_done && is_draw) {
          //   console.log('비겼네요!');
          // } else if (is_done && is_loss) {
          //   console.log('졌네요!');
          // } else if (is_done && !is_loss) {
          //   console.log('이겼네요!');
          // }

          break;
        }
      }
    },
    [canvasRef, contextRef, stateRef, setPiecesCount, setEnemyPiecesCount],
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    // @ts-ignore
    stateRef.current = new State();
    setPiecesCount(stateRef.current.piecesCount(stateRef.current.pieces));
    setEnemyPiecesCount(
      stateRef.current.piecesCount(stateRef.current.enemyPieces),
    );

    // @ts-ignore
    contextRef.current = canvasRef.current.getContext('2d');
    // @ts-ignore
    canvasRef.current.width = CANVAS_SIZE;
    // @ts-ignore
    canvasRef.current.height = CANVAS_SIZE;
  }, [canvasRef, stateRef]);

  useEffect(() => {
    // @ts-ignore
    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current as number);
  }, []);

  const coloredPiecesCount = (x: number, y: number) => (
    <span className={x > y ? 'text-emerald-500' : ''}>{x}</span>
  );

  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4 flex flex-col gap-4 items-center">
      <Helmet>
        <title>알파제로 | Lathello</title>
      </Helmet>
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
            <span className="text-sm text-blueGray-600">
              <span>알파</span>
              <span className="text-emerald-500">제로</span>
            </span>
            <span className="text-lg text-blueGray-600 font-bold">
              {coloredPiecesCount(enemyPiecesCount, piecesCount)}
            </span>
          </div>
        </div>
        <div className="relative">
          {isCalculating && (
            <div className="absolute text-white top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
              <Icon
                name="loading"
                className="animate-spin h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
              />
            </div>
          )}
          {isDone && (
            <div className="absolute top-0 left-0 bg-black w-full h-full bg-opacity-30 backdrop-filter backdrop-blur-sm flex justify-center items-center">
              <div className="flex flex-col gap-8 items-center">
                {isDone && isLoss && (
                  <div className="text-3xl text-white cursor-default user-select-none">
                    아깝네요!
                  </div>
                )}
                {isDone && !isLoss && (
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
            ref={canvasRef}
            onMouseDown={onMouseDown}
            className="w-[30rem] h-[30rem] bg-[#028D64]"
          />
        </div>
      </div>
    </div>
  );
};

export default OthelloAlphaZero;
