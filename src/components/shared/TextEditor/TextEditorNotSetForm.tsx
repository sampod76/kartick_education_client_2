'use client';
import ModalComponent from '@/components/Modal/ModalComponents';
import ImageListInServer from '@/components/ui/ImageListModal/ImageListCom';
import { Button } from 'antd';
import JoditEditor from 'jodit-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const TextEditorNotSetValue = ({
  textEditorValue,
  setTextEditorValue,
  defaultTextEditorValue = '',
  name = 'details',
  height,
  isReset = false,
}: {
  textEditorValue?: string;
  defaultTextEditorValue?: string;
  name?: string;
  height?: number;
  isReset?: boolean;
  setTextEditorValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const editor = useRef<any>(null);
  const [content, setContent] = useState(defaultTextEditorValue);
  const [openTextEditor, setOpenTextEditor] = useState<boolean>(true);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start typing...',
      defaultMode: 1, // Set default alignment to left
      toolbarAdaptive: false,
      //  height: height, // Set the height of the editor
      minHeight: height || 500,
    }),
    [],
  );
  useEffect(() => {
    if (defaultTextEditorValue && !content) {
      setContent(defaultTextEditorValue);
    }
    if (isReset) {
      setContent('');
      setTextEditorValue('');
    }
  }, [defaultTextEditorValue, isReset]);

  return (
    <>
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
          onBlur={(newContent) => {
            setTextEditorValue(newContent);
            setContent(newContent);
          }}
        />
      )}
    </>
  );
};

export default TextEditorNotSetValue;
