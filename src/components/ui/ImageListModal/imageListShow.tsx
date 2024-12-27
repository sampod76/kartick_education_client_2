import { IFileAfterUpload } from '@/types/globalType';
import { Button } from 'antd';
import React from 'react';
interface ImageModalProps {
  addedImages: IFileAfterUpload[];
  setAddedImages: React.Dispatch<React.SetStateAction<IFileAfterUpload[]>>;
  selectMultiple: boolean;
}
export default function ImageListShow({
  setAddedImages,
  addedImages,
  selectMultiple,
}: ImageModalProps) {
  return (
    <div>
      <div style={{ marginTop: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setAddedImages([]);
          }}
        >
          Add Files
        </Button>
      </div>
    </div>
  );
}
