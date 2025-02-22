'use client';
import { CopyFilled } from '@ant-design/icons';
import { message } from 'antd';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
const TextEditorNotSetForm = dynamic(
  () => import('@/components/shared/TextEditor/TextEditorNotSetForm'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    ),
  },
);
export default function TextEditorPage() {
  const [textEditorValue, setTextEditorValue] = useState('');
  const clipboardCopy = () => {
    navigator.clipboard.writeText(textEditorValue);
    message.info('copy to clipboard!');
  };
  return (
    <div>
      <h4 onClick={() => clipboardCopy()} className="text-center my-1">
        Copy <CopyFilled />
      </h4>
      <TextEditorNotSetForm
        textEditorValue={textEditorValue}
        setTextEditorValue={setTextEditorValue}
        height={800}
      />
    </div>
  );
}
