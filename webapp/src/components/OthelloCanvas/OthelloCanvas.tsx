import React, { useCallback, useEffect, useRef } from 'react';
import { CANVAS_SIZE, CELL_COUNT, CELL_SIZE } from '../../lib/othelloConfig';
import Grid from './Grid';
import { throttle } from 'lodash';
import State from './State';
import Piece from './Piece';
import Indicator from './Indicator';
import requestNextState from '../../lib/api/othello/requestNextState';

const OthelloCanvas = () => {
  //   const grid = new Grid();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const requestRef = useRef<number>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);

  const pieces = Array.from(
    { length: CELL_COUNT ** 2 },
    (_, i) => new Piece(i),
  );
  const grid = new Grid();
  let state = new State();
  const indicators = Array.from(
    { length: CELL_COUNT ** 2 },
    (_, i) => new Indicator(i),
  );

  function render() {
    if (!canvasRef.current || !contextRef.current) return;

    // @ts-ignore
    requestRef.current = window.requestAnimationFrame(render);
    contextRef.current.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    grid.draw(contextRef.current);
    // hoverCell.draw(context);

    const isFirstPlayer = state.isFirstPlayer();
    state.pieces.forEach((v, i) => {
      if (v === 1) {
        pieces[i]
          .setIsblack(isFirstPlayer)
          .draw(contextRef.current as CanvasRenderingContext2D);
      }
    });
    state.enemyPieces.forEach((v, i) => {
      if (v === 1) {
        pieces[i]
          .setIsblack(!isFirstPlayer)
          .draw(contextRef.current as CanvasRenderingContext2D);
      }
    });
    if (isFirstPlayer && !state.isDone()) {
      state
        .legalActions()
        .forEach(
          (v) =>
            v !== CELL_COUNT ** 2 &&
            indicators[v]?.draw(contextRef.current as CanvasRenderingContext2D),
        );
    }
  }

  const onMouseDown = useCallback(
    async (e: React.MouseEvent<HTMLCanvasElement>) => {
      // console.log(e.clientX, e.clientY);
      if (!canvasRef.current || !contextRef.current) return;

      console.log('ㅇㅅㅇ');

      const { left, top } = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const index =
        Math.floor(x / CELL_SIZE) + Math.floor(y / CELL_SIZE) * CELL_COUNT;
      const isLegalAction = state.isLegalActionXy(
        Math.floor(x / CELL_SIZE),
        Math.floor(y / CELL_SIZE),
      );

      const isFirstPlayer = state.isFirstPlayer();

      console.log({ index });

      if (isLegalAction && isFirstPlayer) {
        state = state.next(index);
        if (!state.isDone()) {
          while (true) {
            const { action } = await requestNextState({
              pieces: state.pieces,
              enemyPieces: state.enemyPieces,
              depth: state.depth,
            });
            const nextState = state.next(action);
            // 만약 가능한 액션이 없고 아직 끝나지 않았다면 스킵 후 다음 상태를 받아온다.
            if (
              nextState.legalActions()[0] === CELL_COUNT ** 2 &&
              !nextState.isDone()
            ) {
              state = nextState;
            } else {
              state = nextState;
              break;
            }

            console.log('AI 대기중...');
            console.log({ state });
          }
        } else {
          if (state.isLoss()) {
            console.log('게임 패배');
          } else {
            console.log('게임 승리');
          }
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    // @ts-ignore
    contextRef.current = canvasRef.current.getContext('2d');
    // @ts-ignore
    canvasRef.current.width = CANVAS_SIZE;
    // @ts-ignore
    canvasRef.current.height = CANVAS_SIZE;
  }, [canvasRef]);

  useEffect(() => {
    // @ts-ignore
    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current as number);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      className="w-[30rem] h-[30rem] bg-blueGray-600"
    />
  );
};

export default OthelloCanvas;
