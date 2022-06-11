import React from 'react';
import { Helmet } from 'react-helmet-async';

const NewCommunityPost = () => {
  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
      <Helmet>
        <title>포스트 작성 | Re:zero</title>
      </Helmet>
      NewCommunityPost
    </div>
  );
};

export default NewCommunityPost;
