import React from 'react';
import { Link } from 'react-router-dom';

const CreatePostButton = () => {
  return (
    <Link
      to="/community/new"
      className="bg-white border border-blueGray-500 hover:border-emerald-500 text-blueGray-500 hover:text-emerald-500 py-1 px-4 capitalize"
    >
      포스트 작성
    </Link>
  );
};

export default CreatePostButton;
