import PlayController from '@components/PlayController';
import RequireLogIn from '@components/RequireLogin/RequireLogin';
import useAIHistoriesSWR from '@hooks/swr/useAIHistoriesSWR';
import useUsersAIHistoriesSWR from '@hooks/swr/useUsersAIHistoriesSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import useModel from '@hooks/useModel';
import createAIHistory from '@lib/api/othello/createAIHistory';
import Background from '@lib/othello/Background';
import Canvas from '@lib/othello/Canvas';
import Indicator from '@lib/othello/Indicator';
import LastAction from '@lib/othello/LastAction';
import Piece from '@lib/othello/Piece';
import Reversi from '@lib/othello/Reversi';
import {
  BACKGROUND_CANVAS_SIZE,
  CELL_COUNT,
  CELL_SIZE,
  GAME_CANVAS_SIZE,
  TOTAL_CELL_COUNT,
} from '@lib/othelloConfig';
import sleep from '@lib/utils/sleep';
import { ActionIcon, Text } from '@mantine/core';
import changeTheme from '@store/config/changeTheme';
import addHistory from '@store/reversi/addHistory';
import clearHistory from '@store/reversi/clearHistory';
import { throttle } from 'lodash';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Settings } from 'tabler-icons-react';
import useSound from 'use-sound';

export default function PlayComputerPage() {
  // i18n
  const { t } = useTranslation(['common', 'navbar']);

  const { nextAction } = useModel();

  const [play] = useSound('/assets/audios/blop.mp3');
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

  const onChangeTheme = useCallback((value: string) => {
    if (!bgCanvas.current || !gameCanvas.current) return;

    changeTheme(value, bgCanvas.current, gameCanvas.current);
  }, []);

  function render() {
    if (!reversiRef.current || !bgCanvas.current || !gameCanvas.current) return;

    gameCanvas.current.draw();

    gameCanvas.current.update(reversiRef.current);

    requestRef.current = requestAnimationFrame(render);
  }

  const setPiecesCounts = useCallback(
    (reversed: boolean) => {
      if (!reversiRef.current) return;
      const count = reversiRef.current.piecesCount(reversiRef.current.pieces);
      const enemyCount = reversiRef.current.piecesCount(reversiRef.current.enemyPieces);

      setPiecesCount(reversed ? enemyCount : count);
      setEnemyPiecesCount(reversed ? count : enemyCount);
    },
    [reversiRef, setPiecesCount, setEnemyPiecesCount],
  );

  const onRestart = useCallback(() => {
    if (!reversiRef.current) return;
    reversiRef.current = new Reversi();
    setPiecesCount(2);
    setEnemyPiecesCount(2);
    setIsDone(false);
    setIsDraw(false);
    setIsLoss(false);
    clearHistory();
  }, [reversiRef, setPiecesCount, setEnemyPiecesCount, setIsDone, setIsDraw, setIsLoss]);

  const onMouseUp = useCallback(
    async (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!gameCanvas.current || !reversiRef.current || !userData || !nextAction) return;

      // 게임이 끝났거나 플레이어의 턴이 아니면 막기
      if (reversiRef.current.isDone() || !reversiRef.current.isBlackTurn()) {
        console.log('forbidden to play');
        return;
      }

      const { left, top } = gameCanvas.current.canvas.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      let action = Math.floor(x / CELL_SIZE) + Math.floor(y / CELL_SIZE) * CELL_COUNT;
      if (action >= TOTAL_CELL_COUNT || action < 0) return;

      // 자신의 턴이 아닐 때까지 반복
      while (true) {
        const legalActions = reversiRef.current.legalActions();
        if (legalActions[0] === TOTAL_CELL_COUNT) {
          action = TOTAL_CELL_COUNT;
        }

        if (action !== TOTAL_CELL_COUNT && !legalActions.includes(action)) {
          return;
        }

        const nextReversi = reversiRef.current.next(action, true);
        addHistory(nextReversi, action);

        reversiRef.current.pieces[action] = 1;
        // 소리 재생
        play();

        for await (const s of nextReversi.differedFlipQueue.reverse()) {
          await sleep(100);
          console.log({ s });
          reversiRef.current.flip(s);
        }

        reversiRef.current = nextReversi;

        setPiecesCounts(true);

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
        const next = await nextAction(reversiRef.current);
        setIsCalculating(false);

        const nextDoubleReversi = reversiRef.current.next(next, true);
        addHistory(nextDoubleReversi, next);
        reversiRef.current.pieces[next] = 1;

        for await (const s of nextDoubleReversi.differedFlipQueue.reverse()) {
          await sleep(100);
          reversiRef.current.flip(s);
        }
        reversiRef.current = nextDoubleReversi;
        play();
        setPiecesCounts(false);

        const is_done = reversiRef.current.isDone();
        const is_draw = reversiRef.current.isDraw();
        const is_loss = reversiRef.current.isLoss();
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
      userData,
      mutateAIHistories,
      mutateUsersAIHistories,
      nextAction,
      setIsCalculating,
      setIsDone,
      setIsDraw,
      setIsLoss,
      play,
      setPiecesCounts,
    ],
  );

  const onMouseMove = useCallback(
    throttle((e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!gameCanvas.current || !userData) return;

      const { left, top } = gameCanvas.current.canvas.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      gameCanvas.current.mouseX = x;
      gameCanvas.current.mouseY = y;
    }, 20),
    [gameCanvas, userData],
  );

  const onMouseLeave = useCallback(() => {
    if (!gameCanvas.current || !userData) return;

    gameCanvas.current.mouseX = -1;
    gameCanvas.current.mouseY = -1;
  }, [gameCanvas, userData]);

  useEffect(() => {
    if (!gameRef.current || !bgRef.current) return;
    reversiRef.current = new Reversi();

    bgCanvas.current = new Canvas(bgRef.current);
    gameCanvas.current = new Canvas(gameRef.current);

    setPiecesCounts(false);

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
    bgCanvas.current.draw();
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
    <div className="flex flex-col gap-4 items-center">
      <Head>
        <title>AI 대전 - Re:zero</title>
      </Head>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#404040] border border-blueGray-600 rounded-full" />
              <Text size="sm">{userData?.name ?? t('guest')}</Text>
              <Text weight={500}>{coloredPiecesCount(piecesCount, enemyPiecesCount)}</Text>
            </div>
            <div className="flex items-center gap-2 flex-row-reverse">
              <div className="w-8 h-8 bg-white border border-blueGray-600 rounded-full" />
              <Text size="sm">알파제로</Text>
              <Text weight={500}>{coloredPiecesCount(enemyPiecesCount, piecesCount)}</Text>
            </div>
          </div>
          <div className="relative" style={{ width: BACKGROUND_CANVAS_SIZE, height: BACKGROUND_CANVAS_SIZE }}>
            {isCalculating && (
              <div className="absolute text-white top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                loading
              </div>
            )}
            {isDone && (
              <div className="absolute top-0 left-0 bg-black w-full h-full bg-opacity-30 backdrop-filter backdrop-blur-sm flex justify-center items-center z-40">
                {isDone && isLoss && (
                  <div className="text-3xl text-white cursor-default user-select-none">아깝네요!</div>
                )}
                {isDone && !isLoss && !isDraw && (
                  <div className="text-3xl text-white cursor-default user-select-none">이기셨네요!</div>
                )}
                {isDone && isDraw && (
                  <div className="text-3xl text-white cursor-default user-select-none">무승부에요!</div>
                )}
              </div>
            )}
            <canvas ref={bgRef} className="w-full h-full absolute z-10" />
            <canvas
              ref={gameRef}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              style={{ width: GAME_CANVAS_SIZE, height: GAME_CANVAS_SIZE }}
              className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
            />
          </div>
        </div>
        <PlayController onRestart={onRestart} isCalculating={isCalculating} onChangeTheme={onChangeTheme} />
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const initialLocale = locale || 'ko';

  return {
    props: {
      ...(await serverSideTranslations(initialLocale, ['common', 'navbar'])),
    },
  };
};
