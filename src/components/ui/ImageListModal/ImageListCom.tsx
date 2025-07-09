import { IFileAfterUpload } from '@/types/globalType';
import { Select, Tabs } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { FileUploaderUi } from '../FileUploader/FileUploaderUi';
import VimeoFileUpload from '../FileUploader/VimeoFileUpload';
import ImageListShow from './imageListShow';
import VimeoVideoList from './vimeoVideoList';
const { Option } = Select;

interface ImageModalProps {
  addedImages: IFileAfterUpload[];
  setAddedImages: React.Dispatch<React.SetStateAction<IFileAfterUpload[]>>;
  selectMultiple: boolean;
}

const ImageListInServer: React.FC<ImageModalProps> = ({
  addedImages,
  setAddedImages,
  selectMultiple,
}) => {
  const router = useRouter();
  const path = usePathname();
  const searchQuery = useSearchParams();
  const [mainTab, setMainTeb] = React.useState('1');
  // const mainTab = searchQuery.get('mainTab');
  const secondTab = searchQuery.get('secondTab');
  const displayImages: any[] = [];
  const handleMainTabChange = (activeKey: string) => {
    const currentParams = new URLSearchParams(searchQuery.toString());
    currentParams.set('mainTab', activeKey);
    // router.replace(`${path}?${currentParams.toString()}`);
    setMainTeb(activeKey);
  };
  const items = [
    // {
    //   key: '2',
    //   label: 'Additional courses',
    //   children: <AdditionalCourseCard additional_courses={data.additional_courses} />,
    // },
    {
      key: '1',
      label: 'Select Files',
      children: (
        <ImageListShow
          addedImages={addedImages}
          selectMultiple={selectMultiple}
          setAddedImages={setAddedImages}
        />
      ),
    },
    {
      key: '5',
      label: 'Search vimeo Files',
      children: <VimeoVideoList />,
    },
    {
      key: '2',
      label: 'Upload New Custom Files',
      children: <FileUploaderUi />,
    },
    {
      key: '3',
      label: 'Upload Vimeo Files',
      children: <VimeoFileUpload />,
    },
  ];
  return (
    <div>
      <Tabs
        onChange={handleMainTabChange}
        centered
        activeKey={mainTab || '1'}
        defaultActiveKey="1"
        items={items}
      />
    </div>
  );
};

export default ImageListInServer;
