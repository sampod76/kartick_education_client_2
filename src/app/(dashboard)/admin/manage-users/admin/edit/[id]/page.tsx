import EditAdminComponent from '@/components/admin/EditAdmin';

export default function AdminEdit({ params }: any) {
  return (
    <>
      <EditAdminComponent id={params?.id} />
    </>
  );
}
