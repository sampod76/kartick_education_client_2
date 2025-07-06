'use client';

import AddContentMain from '@/components/addContent/addContentMain';
import { Tabs } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function ContentList() {
  return <div>Content list</div>;
}

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
          label: 'Add Content',
          children: <AddContentMain />,
        },
        {
          key: '2',
          label: 'Content list',
          children: <ContentList />,
        },
      ]}
    />
  );
}
