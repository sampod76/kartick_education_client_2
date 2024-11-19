'use client';

import LoadingForDataFetch from '@/components/Utlis/LoadingForDataFetch';

import { useGetSingleStudentQuery } from '@/redux/api/adminApi/moderatorApi';
import UserProfile from '@/components/profile/UserProfile';
import ProfileInstructorPage from '@/components/profile/ProfileInstructorPage';

const StudentDetailsPage = ({ params }: any) => {
  const id = params.id;

  const { data: userData, isLoading: loading } = useGetSingleStudentQuery(id);

  if (loading) {
    return <LoadingForDataFetch />;
  }

  return (
    <div>
      {/* <StudentProfile userData={userData}></StudentProfile> */}
      <ProfileInstructorPage userData={userData} />
    </div>
  );
};

export default StudentDetailsPage;

function useAdminQuery(id: any): { data: any; isLoading: any } {
  throw new Error('Function not implemented.');
}
