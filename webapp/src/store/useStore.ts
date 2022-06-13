import { enableMapSet } from 'immer';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create, { GetState, SetState } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import createConfigSlice, { ConfigSlice } from './configSlice';

enableMapSet();

export type AppState = ConfigSlice;

export type AppSlice<T> = (set: SetState<AppState>, get: GetState<AppState>) => T;

/**
 * 슬라이스를 각각 생성하여 모두 합친 스토어를 만듦.
 */
const useStore = create<AppState>(
  devtools(
    // persist(
    (set, get) => ({
      ...createConfigSlice(set, get),
    }),
  ),
  //   {
  //     name: 'reversi',
  //   },
  // ),)
);

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mountStoreDevtool('Store', useStore);
}

export default useStore;
