import { ErrorModal } from '@/utils/modalHook';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import CustomImageTag from '../CustomTag/CustomImageTag';
import { VideoAddFormModal } from '../FileUploder/VideoUploder';

const { Option } = Select;

interface ImageModalProps {
  addedImages: any[];
  setAddedImages: (images: any[]) => void;
  selectOnlyOne: boolean;
}

const ImageListInServer: React.FC<ImageModalProps> = ({
  addedImages,
  setAddedImages,
  selectOnlyOne,
}) => {
  const [method, setMethod] = useState('selectFile');
  const [searchText, setSearchText] = useState('');
  const [selectedImage, setSelectedImage] = useState<any[]>([]);
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setUploadComplete(false);
  }, []);
  const uploadedImage: never[] = [];
  const resizeImage = (file: File) => {
    return new Promise<File>((resolve) => {
      Resizer.imageFileResizer(
        file,
        800,
        600,
        'JPEG',
        100,
        0,
        (uri) => {
          const compressedImage = new File([uri as BlobPart], file.name, {
            type: file.type,
            lastModified: file.lastModified,
          });
          resolve(compressedImage);
        },
        'file',
      );
    });
  };

  const handleUploadImages = async (images: File[]) => {
    const formData = new FormData();
    if (images.length) {
      for (let i = 0; i < images.length; i++) {
        const compressedImage = await resizeImage(images[i]);
        formData.append('images', compressedImage);
      }

      try {
        const result = [];
      } catch (error) {
        ErrorModal(error);
      }
    }
  };

  const displayImages = selectedOnly ? selectedImage : uploadedImage;

  return (
    <div>
      {uploadComplete ? (
        <div className="text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Button
              type={method === 'selectFile' ? 'primary' : 'default'}
              onClick={() => setMethod('selectFile')}
            >
              Select File
            </Button>
            <Button
              type={method === 'upload' ? 'primary' : 'default'}
              onClick={() => setMethod('upload')}
            >
              Upload New
            </Button>
          </div>
          {method === 'selectFile' ? (
            <div>
              <Input
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                style={{ marginBottom: 16 }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {displayImages.length > 0 ? (
                  displayImages.map((image) => (
                    <div
                      key={image._id}
                      style={{
                        border: selectedImage.includes(image)
                          ? '2px solid blue'
                          : '1px solid #ccc',
                        padding: 8,
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        setSelectedImage((prev) =>
                          selectOnlyOne
                            ? [image]
                            : prev.includes(image)
                              ? prev.filter((img) => img !== image)
                              : [...prev, image],
                        )
                      }
                    >
                      <CustomImageTag src={image} />
                    </div>
                  ))
                ) : (
                  <p>No Images Found</p>
                )}
              </div>
            </div>
          ) : (
            <VideoAddFormModal />
          )}
          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              onClick={() => {
                setAddedImages(selectedImage);
              }}
            >
              Add Files
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageListInServer;
