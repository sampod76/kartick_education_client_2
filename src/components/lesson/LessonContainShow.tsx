'use client';
import { ENUM_VIDEO_PLATFORM } from '@/constants/globalEnums';
import { useAppSelector } from '@/redux/hooks';
import { IFileAfterUpload } from '@/types/globalType';
import { LinkToGetExtensions } from '@/utils/LinkToGetExtensions';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { urlChecker } from '@/utils/urlChecker';
import VimeoPlayer from '@/utils/vimoPlayer';
import { Tabs, Tooltip } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import YouTubePlayer from 'react-player/youtube';
import CustomImageTag from '../ui/CustomTag/CustomImageTag';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
import PDFViewer from '../ui/PdfViewer';
import { ILesson } from '@/schemas/lessonSchema';
import { useAddGradeBookMutation } from '@/redux/api/gradeBookApi';

export default function LessonContainShow({
  lesson,
  modalId,
}: {
  lesson: ILesson;
  modalId: string;
}) {
  console.log(lesson);

  const [addGreadBook] = useAddGradeBookMutation();

  const isPageOpen = useAppSelector((state) => state.modal[modalId || lesson._id]);
  const [activeKey, setActiveKey] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const items: Tab[] | undefined = [];

  // Add videos
  if (lesson?.videos?.length) {
    lesson.videos.forEach((element: any, index: number) => {
      let result;
      if (element.link) {
        result = urlChecker(element.link);
      } else if (element?.path) {
        result = {
          platform: 'custom',
          data: fileObjectToLink(element),
        };
      }
      // console.log(result, 'result');
      const key = index.toString();

      items.push({
        key,
        label: `Video ${index + 1}`,

        children:
          activeKey === key ? (
            <div className="my-3 flex items-center justify-center border">
              {result?.platform === ENUM_VIDEO_PLATFORM.VIMEO ? (
                <VimeoPlayer width={750} height={600} link={element.link} />
              ) : result?.platform === ENUM_VIDEO_PLATFORM.YOUTUBE ? (
                <YouTubePlayer url={result.data as string} />
              ) : (
                <ReactPlayer
                  url={result?.data as string}
                  controls
                  // playing={activeKey === key}
                  className="h-[400px] w-full rounded-md border border-gray-300 shadow-lg sm:h-[600px] sm:w-[600px] md:h-[700px] md:w-[700px] lg:h-[800px] lg:w-[800px]"
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload',
                      },
                    },
                  }}
                />
              )}
            </div>
          ) : null,
      });
    });
  }

  // Add files
  if (lesson?.files?.length) {
    lesson.files.forEach((file: IFileAfterUpload, index: number) => {
      const key = (items.length + index).toString();
      const application = LinkToGetExtensions(fileObjectToLink(file), [
        '.doc',
        '.docx',
        '.pptx',
        '.ppt',
      ]);

      items.push({
        key,
        label: <Tooltip title={file.filename}>File {index + 1}</Tooltip>,
        children:
          activeKey === key ? (
            <div className="my-3 flex items-center justify-center border">
              {file?.mimetype?.includes('image') && (
                <CustomImageTag
                  src={fileObjectToLink(file)}
                  width={500}
                  height={500}
                  className="h-96 w-96"
                />
              )}
              {file?.mimetype?.includes('pdf') && (
                <PDFViewer file={fileObjectToLink(file)} filename={file.filename} />
              )}
              {(application?.type === 'document' || application?.type === 'powerPoint') &&
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
                    onLoad={handleLoad}
                  />
                ))}
            </div>
          ) : null,
      });
    });
  }
  useEffect(() => {
    if (isPageOpen && lesson._id) {
      addGreadBook({
        lesson: lesson._id,
        module: lesson.module?._id || lesson.module,
        milestone: lesson.milestone,
        course: lesson.course,
        category: lesson.category,
        totalCompletedContentRatio: ((Number(activeKey) + 1) / items.length) * 100,
        totalCompletedNumber: Number(activeKey) + 1,
      });
    }
  }, [isPageOpen, lesson._id, activeKey]);
  if (!isPageOpen) return null;
  return (
    <Tabs
      activeKey={activeKey}
      onChange={(key) => {
        setActiveKey(key);
        // console.log(((Number(key) + 1) / items.length) * 100);
      }}
      items={items}
    />
  );
}
