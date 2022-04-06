import * as tf from '@tensorflow/tfjs';
import { LayersModel } from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';
import pvMctsAction from '../lib/othello/pvMcts';
import Reversi from '../lib/othello/Reversi';

export default function useModel() {
  // custom hook that loads the model and returns it
  const [model, setModel] = useState<LayersModel | null>(null);
  const [nextAction, setNextAction] = useState<((reversi: Reversi) => Promise<number>) | null>(null);

  useEffect(() => {
    async function loadModel() {
      const mod = await tf.loadLayersModel('/model.json');
      setModel(mod);
      console.log('Model loaded', { mod });
      setNextAction(() => pvMctsAction(mod, 0));
    }
    loadModel();
    return () => {
      model?.dispose();
      setModel(null);
      setNextAction(null);
    };
  }, []);

  return { model, nextAction };
}
