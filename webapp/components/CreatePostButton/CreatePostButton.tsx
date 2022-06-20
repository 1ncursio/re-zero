import React from 'react';
import Link from 'next/link';

const CreatePostButton = () => {
  return (
    <Link
      href="/community/new"
      className="bg-white border border-blueGray-500 hover:border-emerald-500 text-blueGray-500 hover:text-emerald-500 py-1 px-4"
    >
      <a>포스트 작성</a>
    </Link>
  );
};

export default CreatePostButton;
