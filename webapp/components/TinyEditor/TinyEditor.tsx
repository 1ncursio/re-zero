import React, { forwardRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

type BlobInfo = {
  blob: () => Blob;
};

type TinyEditorProps = {
  onUploadImage: (
    blobInfo: BlobInfo,
    success: (url: string) => void,
    failure: (err: string) => void,
  ) => Promise<void>;
  initialValue?: string;
};

const TinyEditor = forwardRef<Editor, TinyEditorProps>(({ onUploadImage, initialValue }, ref) => {
  return (
    <Editor
      apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
      // onInit={onInitHandler}
      // @ts-ignore
      onInit={(evt, editor) => (ref.current = editor)}
      initialValue={initialValue || ''}
      init={{
        height: 300,
        menubar: false,
        plugins: ['lists', 'image', 'quickbars', 'link'],
        file_picker_types: 'file image media',
        toolbar: `formatselect bold numlist bullist |
                      alignleft aligncenter alignright alignjustify |
                      outdent indent |
                      forecolor backcolor |
                      image`,
        quickbars_selection_toolbar: `h2 h3 h4 bold italic forecolor backcolor |
                                          alignleft aligncenter alignright alignjustify |
                                          outdent indent |
                                          link blockquote`,
        image_advtab: true,
        images_upload_handler: onUploadImage,
      }}
    />
  );
});

export default TinyEditor;
