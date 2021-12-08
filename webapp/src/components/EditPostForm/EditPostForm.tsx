import { Editor } from '@tinymce/tinymce-react';
import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import { useParams } from 'react-router-dom';
import usePostSWR from '../../hooks/swr/usePostSWR';
import useInput from '../../hooks/useInput';
import uploadImage from '../../lib/api/comments/uploadImage';
import TinyEditor from '../TinyEditor';

type EditPostFormProps = {
  title: string;
  onChangeTitle: (e: any) => void;
  setTitle: Dispatch<SetStateAction<string>>;
};

const EditPostForm = forwardRef<Editor, EditPostFormProps>(
  ({ title, onChangeTitle, setTitle }, ref) => {
    const { postId } = useParams<{ postId: string }>();

    const { data: postData } = usePostSWR(postId);

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

    useEffect(() => {
      if (postData) {
        setTitle(postData.title);
      }
    }, [postData?.title]);

    if (!postData) {
      return null;
    }

    return (
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={onChangeTitle}
          placeholder="제목"
          className="focus:outline-none focus:shadow-outline border border-gray-300 py-2 px-4"
        />
        <TinyEditor
          onUploadImage={onUploadImage}
          ref={ref}
          initialValue={postData.content}
        />
      </div>
    );
  },
);

export default EditPostForm;
