'use client';
import { Tabs, TabsProps } from 'antd';
import { useState } from 'react';
import LessonList from '../lesson/LessonList';
// import GlossaryPage from "../"
import { ContainerOutlined, ReadOutlined, SettingOutlined } from '@ant-design/icons';
import GlossaryPage from '../Glossary/Glossary';
import ResourcePage from '../Resource/ResourceViewForTabs';

const { TabPane } = Tabs;
export default function ModuleTab({
  moduleId,
  moduleData,
}: {
  moduleId: string;
  moduleData: any[];
}) {
  // console.log(moduleData)

  // const {data:QuizData} = useGetQui

  const [activeTabKey, setActiveTabKey] = useState('1');
  const handleTabClick = (key: any) => {
    setActiveTabKey(key);
  };

  const tabsItems: TabsProps['items'] = [
    {
      label: (
        <button className="text-xl font-bold text-[#323232]">
          <ContainerOutlined
            style={{
              fontSize: '1.5rem',
            }}
          />{' '}
          <h1 className="md:text-md text-sm lg:text-lg">Lessons & Quizes</h1>
        </button>
      ),
      key: '1',
      children: <LessonList moduleId={moduleId} moduleData={moduleData} />,
    },

    {
      label: (
        <button className="text-xl font-bold text-[#323232]">
          <ReadOutlined
            style={{
              fontSize: '1.5rem',
            }}
          />
          <h1 className="md:text-md text-sm lg:text-lg">Glossary</h1>
        </button>
      ),
      key: '3',
      children: <GlossaryPage moduleId={moduleId} />,
    },

    {
      label: (
        <button className="text-xl font-bold text-[#323232]">
          {' '}
          <SettingOutlined
            style={{
              fontSize: '1.5rem',
            }}
          />
          <h1 className="md:text-md text-sm lg:text-lg"> Resources</h1>
        </button>
      ),
      key: '4',
      children: <ResourcePage moduleId={moduleId} />,
    },
  ];
  return (
    <div className="mt-5 bg-slate-100">
      <Tabs
        defaultActiveKey={activeTabKey}
        tabBarStyle={{
          padding: '10px',
          borderRadius: '8px',

          // backgroundColor: '#D9D9D9'
        }}
        centered
        animated
        items={tabsItems}
        onChange={handleTabClick}
      ></Tabs>
    </div>
  );
}
