import CustomImageTag from '@/components/ui/CustomTag/CustomImageTag';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { useGetAllCourseQuery } from '@/redux/api/adminApi/courseApi';
import { Select } from 'antd';
import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function CategoryToShowCourseList({
  category_id,
  setCourseId,
}: {
  category_id: string;
  setCourseId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const search = useSearchParams();

  const courseQuery = {
    category: category_id,
    limit: 100,
    sortBy: 'showing_number',
    sortOrder: 'asc',
  };
  const { data, isLoading } = useGetAllCourseQuery(courseQuery);

  if (isLoading) return <LoadingSkeleton />;
  console.log('🚀 ~ Gradebook_v2 ~ data:', data?.data);

  const options = data?.data.map((course: any) => ({
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <CustomImageTag
          src={course.image}
          alt={course.title}
          //@ts-ignore
          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
        />
        <span>{course.title}</span>
      </div>
    ),
    value: course._id,
  }));

  return (
    <div>
      <Select
        onChange={setCourseId}
        style={{ width: '100%' }}
        placeholder="Select a course"
        options={options}
      />
    </div>
  );
}
