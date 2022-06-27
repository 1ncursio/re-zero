import useStore from '@store/useStore';

export default function clearHistory() {
  useStore.setState((state) => {
    state.reversi.histories = [];
  });
}
