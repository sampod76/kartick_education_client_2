'use client';

import AddContentMain from '@/components/addContent/addContentMain';
import AllContentList from '@/components/addContent/allContentList';
import { Tabs } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TimeTracker from './materials/timeTracker';
import Gradebook from './materials/gradebook';
import Reports from './materials/reports';

export default function StudentMaterial() {
  const router = useRouter();
  const path = usePathname();

  const searchQuery = useSearchParams();
  const activeTab = searchQuery.get('activeTab');

  const handleSecondTabChange = (activeKey: string) => {
    const currentParams = new URLSearchParams(searchQuery.toString());
    currentParams.set('activeTab', activeKey);
    router.replace(`${path}?${currentParams.toString()}`);
  };

  return (
    <Tabs
      // defaultActiveKey="1"
      activeKey={activeTab || '1'}
      type="card"
      centered
      onChange={handleSecondTabChange}
      items={[
        {
          key: '1',
          label: 'Attendance list',
          children: <TimeTracker />,
        },
        {
          key: '2',
          label: 'Gradebook',
          children: <Gradebook />,
        },
        {
          key: '3',
          label: 'Reports',
          children: <Reports />,
        },
      ]}
    />
  );
}
