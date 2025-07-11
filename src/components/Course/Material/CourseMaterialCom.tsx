'use client';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import CreateMilestone from '@/components/milestone/create/createAndUpdateMilestoned';
import MileStoneList from '@/components/milestone/MilestoneDashList';
import MilestoneSerialUpdate from '@/components/milestone/MilestoneSerialUpdate';
import MilestoneToModuleTransfer from '@/components/milestone/MilestoneToModuleTransfer';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { useGetSingleCourseQuery } from '@/redux/api/adminApi/courseApi';
import { Tabs } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AdditionalCourseCard from './AdditionalCourse/AdditionalCourseCard';
import Announcement from './Announcement/AnnouncementDistList';
import CourseCardMaterial from './CourseCardMaterial';

export default function CourseMaterialCom({ courseId }: { courseId: string }) {
  const router = useRouter();
  const path = usePathname();

  const searchQuery = useSearchParams();
  const mainTab = searchQuery.get('mainTab');
  const secondTab = searchQuery.get('secondTab');

  const { userInfo } = useGlobalContext();
  const { data, isLoading } = useGetSingleCourseQuery(courseId);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const items = [
    {
      key: '1',
      label: 'Announcement',
      children: <Announcement courseId={courseId} />,
    },
  ];

  if (userInfo?.role === 'seller' || userInfo?.role === 'admin') {
    items.splice(1, 0, {
      key: '2',
      label: 'Additional courses',
      children: <AdditionalCourseCard additional_courses={data.additional_courses} />,
    });
  }
  const handleSecondTabChange = (activeKey: string) => {
    const currentParams = new URLSearchParams(searchQuery.toString());
    currentParams.set('secondTab', activeKey);
    router.replace(`${path}?${currentParams.toString()}`);
  };
  if (userInfo?.role === 'seller' || userInfo?.role === 'admin') {
    items.unshift({
      key: '0',
      label: 'Milestone',
      children: (
        <div>
          <Tabs
            type="card"
            centered
            onChange={handleSecondTabChange}
            activeKey={secondTab || '1'}
            items={[
              {
                key: '1',
                label: 'Milestone List',
                children: (
                  <MileStoneList
                    queryObject={{
                      course: courseId,
                      category: data?.category?._id,
                      sortBy: 'milestone_number',
                      setSortOrder: 'asc',
                    }}
                  />
                ),
              },
              {
                key: '21',
                label: 'Create Milestone',
                children: (
                  <CreateMilestone
                    courseId={courseId}
                    categoryId={data?.category?._id}
                    title={data.title}
                  />
                ),
              },
              {
                key: '2',
                label: 'Milestone Position Update',
                children: (
                  <MilestoneSerialUpdate
                    queryObject={{ course: courseId, category: data?.category?._id }}
                  />
                ),
              },

              {
                key: '3',
                label: 'Module Transfer',
                children: (
                  <MilestoneToModuleTransfer
                    queryObject={{ course: courseId, category: data?.category?._id }}
                  />
                ),
              },
            ]}
          />
        </div>
      ),
    });
  }

  const handleMainTabChange = (activeKey: string) => {
    const currentParams = new URLSearchParams(searchQuery.toString());
    currentParams.set('mainTab', activeKey);
    router.replace(`${path}?${currentParams.toString()}`);
  };

  return (
    <div>
      <CourseCardMaterial course={data} />
      <Tabs
        onChange={handleMainTabChange}
        centered
        activeKey={mainTab || '0'}
        defaultActiveKey="0"
        items={items}
      />
    </div>
  );
}
