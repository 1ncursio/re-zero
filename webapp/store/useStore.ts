import { enableMapSet } from 'immer';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import createConfigSlice, { ConfigSlice } from './config/slice';
import createReversiSlice, { ReversiSlice } from './reversi/slice';

enableMapSet();

export type AppState = ConfigSlice & ReversiSlice;
export type Mis = [['zustand/devtools', never], ['zustand/immer', never]];

/**
 * 슬라이스를 각각 생성하여 모두 합친 스토어를 만듦.
 */
const useStore = create<AppState>()(
  devtools(
    immer(
      // persist(
      (...a) => ({
        ...createConfigSlice(...a),
        ...createReversiSlice(...a),
      }),
    ),
    {
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
  //   {
  //     name: 'reversi',
  //   },
  // ),)
);

export default useStore;
