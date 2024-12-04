import UserCreateComponent from '@/components/User/UserCreate';
import { USER_ROLE } from '@/constants/role';

export default function CreateStudentPage() {
  const role: {
    label: string;
    value: string;
  } = {
    label: USER_ROLE.STUDENT,
    value: USER_ROLE.STUDENT,
  };

  return (
    <>
      <UserCreateComponent role={role} />
    </>
  );
}
