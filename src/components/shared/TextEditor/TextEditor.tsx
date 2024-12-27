'use client';
import ModalComponent from '@/components/Modal/ModalComponents';
import ImageListInServer from '@/components/ui/ImageListModal/ImageListCom';
import { Button } from 'antd';
import JoditEditor from 'jodit-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
const TextEditor = ({
  textEditorValue,
  setTextEditorValue,
  defaultTextEditorValue = '',
  name = 'details',
  isReset = false,
}: {
  textEditorValue?: string;
  defaultTextEditorValue?: string;
  name?: string;
  isReset?: boolean;
  setTextEditorValue?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState(defaultTextEditorValue);
  const [openTextEditor, setopenTextEditor] = useState<boolean>(true);
  const { setValue } = useFormContext();

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start typing...',
      // allowFileUpload: true,
      // sanitize: false,
      defaultMode: 1, // Set default alignment to left
      toolbarAdaptive: false,
    }),
    [],
  );

  useEffect(() => {
    if (isReset) {
      setContent('');
    }
  }, [isReset]);

  // const onChange = (checked: boolean) => {
  //   // console.log(`switch to ${checked}`);
  //   setopenTextEditor((v) => !v)
  // };

  return (
    <div>
      <div className="flex justify-end my-1">
        <ModalComponent button={<Button type="primary">Open file list</Button>}>
          <ImageListInServer addedImages={[]} selectMultiple setAddedImages={() => {}} />
        </ModalComponent>
      </div>
      {openTextEditor && (
        <JoditEditor
          ref={editor}
          config={editorConfig}
          value={content}
          // tabIndex={1} // tabIndex of textarea
          onBlur={(newContent) => {
            setValue(name, newContent);
            setContent(newContent);
          }} // preferred to use only this option to update the content for performance reasons
          // onChange={(newContent) => {

          //   setValue(name, newContent);
          // }}
        />
      )}
    </div>
  );
};

export default TextEditor;
