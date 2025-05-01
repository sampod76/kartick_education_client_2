'use client';
import { useAppSelector } from '@/redux/hooks';
import { IFileAfterUpload } from '@/types/globalType';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { LinkToGetExtensions } from '@/utils/LinkToGetExtensions';
import { Tabs } from 'antd';
import { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import ReactPlayer from 'react-player';
import CustomImageTag from '../ui/CustomTag/CustomImageTag';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
import PDFViewer from '../ui/PdfViewer';

export default function FileContainShow({
  files,
  modalId,
}: {
  files: IFileAfterUpload[];
  modalId: string;
}) {
  const isPageOpen = useAppSelector((state) => state.modal[modalId]);
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState('0'); // Track active tab

  const handleLoad = () => {
    setLoading(false);
  };

  const items = files.map((file: IFileAfterUpload, index: number) => {
    const key = index.toString();

    if (modalId && !isPageOpen) {
      return {
        key,
        label: `File ${index + 1}`,
        children: (
          <div className="text-center text-gray-400 py-8">Content is closed.</div>
        ),
      };
    }

    let childrenContent: JSX.Element | null = null;

    if (activeKey === key) {
      if (file?.fileType?.includes('video')) {
        childrenContent = (
          <div className="my-3 border flex justify-center items-center">
            <ReactPlayer
              controls
              playing
              url={fileObjectToLink(file)}
              className="h-[400px] w-full rounded-md border border-gray-300 shadow-lg sm:h-[600px] sm:w-[600px] md:h-[700px] md:w-[700px] lg:h-[800px] lg:w-[800px]"
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload',
                  },
                },
              }}
            />
          </div>
        );
      } else if (file?.fileType?.includes('audio')) {
        childrenContent = (
          <div className="my-3 border flex justify-center items-center">
            <AudioPlayer
              autoPlay
              src={fileObjectToLink(file)}
              crossOrigin="anonymous"
              preload="auto"
            />
          </div>
        );
      } else {
        const application = LinkToGetExtensions(fileObjectToLink(file), [
          '.doc',
          '.docx',
          '.pptx',
          '.ppt',
        ]);

        childrenContent = (
          <div className="my-3 border">
            {file?.mimetype?.includes('image') && (
              <CustomImageTag
                src={fileObjectToLink(file)}
                width={500}
                height={500}
                className="h-96 w-96"
              />
            )}
            {file?.mimetype?.includes('pdf') && (
              <PDFViewer file={fileObjectToLink(file)} />
            )}
            {application?.type === 'document' &&
              (loading ? (
                <LoadingSkeleton />
              ) : (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    fileObjectToLink(file),
                  )}`}
                  className="h-[400px] w-full rounded-md border border-gray-300 shadow-lg sm:h-[600px] sm:w-[600px] md:h-[700px] md:w-[700px] lg:h-[800px] lg:w-[800px]"
                  style={{ border: 'none' }}
                  title={file?.filename}
                  loading="lazy"
                />
              ))}
            {application?.type === 'powerPoint' &&
              (loading ? (
                <LoadingSkeleton />
              ) : (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    fileObjectToLink(file),
                  )}`}
                  className="h-[400px] w-full rounded-md border border-gray-300 shadow-lg sm:h-[600px] sm:w-[600px] md:h-[700px] md:w-[700px] lg:h-[800px] lg:w-[800px]"
                  style={{ border: 'none' }}
                  title={file?.filename}
                  loading="lazy"
                />
              ))}
          </div>
        );
      }
    }

    return {
      key,
      label: `File ${index + 1}`,
      children: childrenContent || (
        <div className="text-center text-gray-400 py-8">
          Select this tab to view content
        </div>
      ),
    };
  });

  return (
    <Tabs
      defaultActiveKey="0"
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key)}
      items={items}
    />
  );
}
