import { USER_ROLE } from '@/constants/role';
import { useGetSingleStudentQuery } from '@/redux/api/adminApi/studentApi';
import UserProfile from '../profile/UserProfile';
import LoadingForDataFetch from '../Utlis/LoadingForDataFetch';

export default function StudentProfileView({ id }: { id: string }) {
  const { data: userData, isLoading: loading } = useGetSingleStudentQuery(id);

  if (loading) {
    return <LoadingForDataFetch />;
  }

  return (
    <div>
      <UserProfile userData={{ ...userData, role: USER_ROLE.STUDENT }}></UserProfile>
    </div>
  );
}
