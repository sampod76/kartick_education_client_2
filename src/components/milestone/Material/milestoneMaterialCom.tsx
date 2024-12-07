'use client';

import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { Tabs } from 'antd';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import ModuleDashList from '@/components/module/ModuleDashList';
import ModuleSerialUpdate from '@/components/module/ModulSerialUpdate';
import { useGetSingleMilestoneQuery } from '@/redux/api/adminApi/milestoneApi';

export default function MilestoneMaterialCom({ milestoneId }: { milestoneId: string }) {
  const { userInfo } = useGlobalContext();
  const { data, isLoading } = useGetSingleMilestoneQuery(milestoneId);
  console.log('🚀 ~ MilestoneMaterialCom ~ data:', data);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const items = [
    // {
    //   key: '2',
    //   label: 'Additional courses',
    //   children: <AdditionalCourseCard additional_courses={data.additional_courses} />,
    // },
    {
      key: '1',
      label: 'Modules',
      children: (
        <div>
          <Tabs
            type="card"
            centered
            items={[
              {
                key: '1',
                label: 'Module List',
                children: (
                  <ModuleDashList
                    queryObject={{
                      course: data?.course?._id,
                      category: data.category,
                      milestone: milestoneId,
                      sortBy: 'module_number',
                      setSortOrder: 'asc',
                    }}
                  />
                ),
              },
              {
                key: '2',
                label: 'Module Position Update',
                children: (
                  <ModuleSerialUpdate
                    queryObject={{
                      course: data?.course?._id,
                      category: data.category,
                      milestone: milestoneId,
                    }}
                  />
                ),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* <CourseCardMaterial course={data} /> */}
      <div>
        <h1 className="text-center">Milestone title: {data?.title}</h1>
      </div>
      <Tabs centered defaultActiveKey="1" items={items} />
    </div>
  );
}
