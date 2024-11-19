'use client';
import EditAdminComponent from '@/components/admin/EditAdmin';
import EditSellerComponent from '@/components/seller/editSeller';
import EditStudentComponent from '@/components/student/editStudent';
import { useSearchParams } from 'next/navigation';

const ProfileUpdate = ({ params }: any) => {
  const query = useSearchParams();
  const role = query.get('role');
  return (
    <div>
      {role === 'seller' ? (
        <EditSellerComponent id={params?.id} />
      ) : role === 'student' ? (
        <EditStudentComponent id={params?.id} />
      ) : role === 'admin' ? (
        <EditAdminComponent id={params?.id} />
      ) : null}
    </div>
  );
};

export default ProfileUpdate;
