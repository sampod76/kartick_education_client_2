'use client';
import { ENUM_VIDEO_PLATFORM } from '@/constants/globalEnums';
import { IFileAfterUpload } from '@/types/globalType';
import { LinkToGetExtensions } from '@/utils/LinkToGetExtensions';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { urlChecker } from '@/utils/urlChecker';
import VimeoPlayer from '@/utils/vimoPlayer';
import { Tabs, Tooltip } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import { useState } from 'react';
import YouTubePlayer from 'react-player/youtube';
import CustomImageTag from '../ui/CustomTag/CustomImageTag';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
import PDFViewer from '../ui/PdfViewer';

export default function LessonContainShow({ lesson }: { lesson: any }) {
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };
  const items: Tab[] | undefined = [];

  if (lesson?.videos?.length) {
    lesson?.videos.forEach((element: any, index: number) => {
      const result = urlChecker(element.link);
      items?.push({
        key: index.toString() + 84,
        label: `Video ${index + 1}`,
        children: (
          <div className="my-3 flex items-center justify-center border">
            {result.platform === ENUM_VIDEO_PLATFORM.VIMEO ? (
              <div className="flex items-center justify-center">
                <VimeoPlayer width={750} height={600} link={element.link} />
              </div>
            ) : result.platform === ENUM_VIDEO_PLATFORM.YOUTUBE ? (
              <div className="flex items-center justify-center">
                <YouTubePlayer url={result.data as string} />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <YouTubePlayer url={result.data as string} />
              </div>
            )}
          </div>
        ),
      });
    });
  }

  const files = lesson?.files?.map((file: IFileAfterUpload, index: number) => {
    const application = LinkToGetExtensions(fileObjectToLink(file), [
      '.doc',
      '.docx',
      '.pptx',
      '.ppt',
    ]);

    return {
      key: index.toString(),
      label: <Tooltip title={file.filename}>File {index + 1}</Tooltip>,
      children: (
        <div className="my-3 flex items-center justify-center border">
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
                onLoad={handleLoad}
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
                onLoad={handleLoad}
              />
            ))}
        </div>
      ),
    };
  });
  items.push(...files);

  return <Tabs defaultActiveKey="0" items={items} />;
  //  else {
  //   return <div className="my-4 w-full text-center">No content found.</div>;
  // }
}
