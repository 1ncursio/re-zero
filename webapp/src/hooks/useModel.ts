import * as tf from '@tensorflow/tfjs';
import { LayersModel } from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';

export default function useModel() {
  // custom hook that loads the model and returns it
  const [model, setModel] = useState<LayersModel | null>(null);

  useEffect(() => {
    async function loadModel() {
      const mod = await tf.loadLayersModel('/model.json');
      console.log({ mod });
      setModel(mod);
    }
    loadModel();
  }, []);

  return model;
}
