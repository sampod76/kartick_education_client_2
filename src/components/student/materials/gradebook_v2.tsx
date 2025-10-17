import CustomImageTag from '@/components/ui/CustomTag/CustomImageTag';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { configEnv } from '@/helpers/config/envConfig';
import { useGetAllCourseQuery } from '@/redux/api/adminApi/courseApi';
import { useGetCourseToAllMilestoneAndQuizzesCountQuery } from '@/redux/api/public/purchaseCourseApi';
import { Select } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import CategoryToShowCourseList from './gradebookCom/CategoryToShowCourseList';
import { Divider } from 'antd';
import MilestoneListByCourseId from './gradebookCom/MilestoneListByCourseId';
export default function Gradebook_v2() {
  const [courseId, setCourseId] = useState('');
  const search = useSearchParams();
  const userId = search.get('user_id') || ''; // when student call then auto add server

  return (
    <div>
      <CategoryToShowCourseList
        category_id={configEnv.private_academy_category_id as string}
        setCourseId={setCourseId}
      />
      <Divider />
      {courseId ? (
        <>
          <MilestoneListByCourseId course_id={courseId} user_id={userId} />
        </>
      ) : (
        <h1 className="text-center text-blue-500 animate-bounce">
          Please select a course
        </h1>
      )}
    </div>
  );
}
