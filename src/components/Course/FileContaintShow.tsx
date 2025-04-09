'use client';
import { IFileAfterUpload } from '@/types/globalType';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { LinkToGetExtensions } from '@/utils/LinkToGetExtensions';
import { Collapse, Tabs } from 'antd';
import { useState } from 'react';
import CustomImageTag from '../ui/CustomTag/CustomImageTag';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
import PDFViewer from '../ui/PdfViewer';
import ReactPlayer from 'react-player';
import AudioPlayer from 'react-h5-audio-player';

const { Panel } = Collapse;

export default function FileContainShow({ files }: { files: IFileAfterUpload[] }) {
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const items = files.map((file: IFileAfterUpload, index: number) => {
    if (file?.fileType?.includes('video')) {
      return {
        key: index.toString(),
        label: `Video ${index + 1}`,
        children: (
          <div className="my-3 border flex justify-center items-center">
            <ReactPlayer
              controls
              className="h-[400px] w-full rounded-md border border-gray-300 shadow-lg sm:h-[600px] sm:w-[600px] md:h-[700px] md:w-[700px] lg:h-[800px] lg:w-[800px]"
              url={fileObjectToLink(file)}
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload', // This disables the download button
                  },
                },
              }}
              // onLoad={handleLoad}
            />
          </div>
        ),
      };
    } else if (file?.fileType?.includes('audio')) {
      return {
        key: index.toString(),
        label: `Audio ${index + 1}`,
        children: (
          <div className="my-3 border flex justify-center items-center">
            <AudioPlayer
              autoPlay={false}
              // src={getBaseUrl() + '/paly-audio/' + 'audio-5456646456454.mp3'}
              src={fileObjectToLink(file)}
              // onPlay={e => console.log("onPlay")}
              crossOrigin="anonymous"
              preload="auto"
              // onLoadedMetaData={}
              // other props here
            />
          </div>
        ),
      };
    }
    const application = LinkToGetExtensions(fileObjectToLink(file), [
      '.doc',
      '.docx',
      '.pptx',
      '.ppt',
    ]);

    return {
      key: index.toString(),
      label: `File ${index + 1}`,
      children: (
        <div className="my-3 border">
          {file.mimetype.includes('image') && (
            <CustomImageTag
              src={fileObjectToLink(file)}
              width={500}
              height={500}
              className="h-96 w-96"
            />
          )}
          {file.mimetype.includes('pdf') && <PDFViewer file={fileObjectToLink(file)} />}
          {application?.type === 'document' &&
            (loading ? (
              <LoadingSkeleton />
            ) : (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileObjectToLink(file))}`}
                className="h-[400px] w-full rounded-md border border-gray-300 shadow-lg sm:h-[600px] sm:w-[600px] md:h-[700px] md:w-[700px] lg:h-[800px] lg:w-[800px]"
                style={{ border: 'none' }}
                title={file?.filename}
                loading="lazy"
                // onLoad={handleLoad}
              />
            ))}
          {application?.type === 'powerPoint' &&
            (loading ? (
              <LoadingSkeleton />
            ) : (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileObjectToLink(file))}`}
                className="h-[400px] w-full rounded-md border border-gray-300 shadow-lg sm:h-[600px] sm:w-[600px] md:h-[700px] md:w-[700px] lg:h-[800px] lg:w-[800px]"
                style={{ border: 'none' }}
                title={file?.filename}
                loading="lazy"
                // onLoad={handleLoad}
              />
            ))}
        </div>
      ),
    };
  });

  return <Tabs defaultActiveKey="0" items={items} />;
}
