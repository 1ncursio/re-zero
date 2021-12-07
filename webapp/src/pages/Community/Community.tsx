import { Editor } from '@tinymce/tinymce-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import CreatePostButton from '../../components/CreatePostButton';
import Pagination from '../../components/Pagination';
import PostList from '../../components/PostList/PostList';
import StyledModal from '../../components/StyledModal';
import TinyEditor from '../../components/TinyEditor';
import usePostsSWR from '../../hooks/swr/usePostsSWR';
import useBoolean from '../../hooks/useBoolean';
import useQuery from '../../hooks/useQuery';
import uploadImage from '../../lib/api/comments/uploadImage';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const Community = () => {
  const [isOpen, openModal, closeModal] = useBoolean(false);
  const query = useQuery();
  const page = Number(query.get('page')) || 1;
  const editorRef = useRef<Editor>(null);

  const { data: postsData, links: linksData } = usePostsSWR({
    page,
  });

  // for ux purpose only (pagination)
  usePostsSWR({
    page: page + 1,
  });

  const onUploadImage = useCallback(async (blobInfo, success, failure) => {
    try {
      const formData = new FormData();
      formData.append('image', blobInfo.blob());
      const imageName = await uploadImage(formData);
      // const { data } = await axios.post('/questions/image', formData);
      success(`http://localhost:8000/storage/images/${imageName}`);
      // console.log(data);
    } catch (error) {
      console.error(error);
      failure();
    }
  }, []);

  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4 flex flex-col gap-4">
      <Helmet>
        <title>Community | Lathello</title>
      </Helmet>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openModal}
          className="bg-white border border-blueGray-500 hover:border-emerald-500 text-blueGray-500 hover:text-emerald-500 py-1 px-4 capitalize"
        >
          포스트 작성
        </button>
        <StyledModal
          isOpen={isOpen}
          onRequestClose={closeModal}
          onRequestOk={() => {}}
          title="포스트 작성"
          showCloseButton
          showOkButton
          width="1024px"
          okText="작성"
        >
          <TinyEditor onUploadImage={onUploadImage} ref={editorRef} />
        </StyledModal>
      </div>
      {postsData && <PostList posts={postsData} />}
      <Pagination links={linksData} />
    </div>
  );
};

export default Community;
