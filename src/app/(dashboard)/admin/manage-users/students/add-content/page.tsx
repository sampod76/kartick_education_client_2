'use client';

import AddContentMain from '@/components/addContent/addContentMain';
import AllContentList from '@/components/addContent/allContentList';
import { Tabs } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function AddContent() {
  const router = useRouter();
  const path = usePathname();

  const searchQuery = useSearchParams();
  const mainTab = searchQuery.get('mainTab');
  const secondTab = searchQuery.get('secondTab');

  const handleSecondTabChange = (activeKey: string) => {
    const currentParams = new URLSearchParams(searchQuery.toString());
    currentParams.set('mainTab', activeKey);
    router.replace(`${path}?${currentParams.toString()}`);
  };

  return (
    <Tabs
      // defaultActiveKey="1"
      activeKey={mainTab || '1'}
      type="card"
      centered
      onChange={handleSecondTabChange}
      items={[
        {
          key: '1',
          label: 'Content list',
          children: <AllContentList />,
        },
        {
          key: '2',
          label: 'Add Content',
          children: <AddContentMain />,
        },
      ]}
    />
  );
}
