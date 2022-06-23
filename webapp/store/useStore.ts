import { enableMapSet } from 'immer';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create, { GetState, SetState } from 'zustand';
import { devtools } from 'zustand/middleware';
// import { immer } from 'zustand/middleware/immer';
import createConfigSlice, { ConfigSlice } from './configSlice';
import createReversiSlice, { ReversiSlice } from './reversiSlice';

enableMapSet();

export type AppState = ConfigSlice & ReversiSlice;

export type AppSlice<T> = (set: SetState<AppState>, get: GetState<AppState>) => T;

/**
 * 슬라이스를 각각 생성하여 모두 합친 스토어를 만듦.
 */
const useStore = create<AppState>(
  devtools(
    // persist(
    (set, get) => ({
      ...createConfigSlice(set, get),
      ...createReversiSlice(set, get),
    }),
    {
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
  //   {
  //     name: 'reversi',
  //   },
  // ),)
);

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mountStoreDevtool('Store', useStore);
}

export default useStore;
