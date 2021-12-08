import React from 'react';
import { Helmet } from 'react-helmet-async';
import OthelloCanvas from '../../components/OthelloCanvas';

const OthelloAlphaZero = () => {
  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4 flex flex-col gap-4">
      <Helmet>
        <title>알파제로 | Lathello</title>
      </Helmet>
      <OthelloCanvas />
    </div>
  );
};

export default OthelloAlphaZero;
