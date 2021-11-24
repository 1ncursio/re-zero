import React, { useEffect } from 'react';
import usePostSWR from '../../hooks/swr/usePostSWR';

const Community = () => {
  const { data: postsData } = usePostSWR();
  useEffect(() => {
    console.log('postsData', postsData);
  }, [postsData]);
  return <div>Community</div>;
};

export default Community;
