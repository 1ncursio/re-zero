import { StateCreator } from 'zustand';
import theme, { Theme } from '../../config/theme';
import { AppState, Mis } from '../useStore';

//define types for state values and actions separately
export type ConfigSlice = {
  config: {
    theme: Theme;
  };
};

//define the initial state
export const initialConfigState: ConfigSlice = {
  config: {
    theme: { ...theme.default },
  },
};

const createConfigSlice: StateCreator<AppState, Mis, [], ConfigSlice> = (...args) => ({
  ...initialConfigState,
});

export default createConfigSlice;
