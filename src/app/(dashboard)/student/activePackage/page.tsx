'use client';
import StudentActivePackageToCourse from '@/components/dashboard/student/StudentActivePackageToCourse';

export default function ActivePackagePage() {
  // const userInfo = getUserInfo() as any;
  // const { data, isLoading } = useGetAllPackageAndCourseQuery(
  //   { user: userInfo.id },
  //   { skip: !Boolean(userInfo.id) }
  // );
  // //@ts-ignore
  // const getPackage= data.data

  // if (isLoading) {
  //   return <LoadingSkeleton number={20} />;
  // }
  return (
    <div>
      <StudentActivePackageToCourse />
    </div>
  );
}
