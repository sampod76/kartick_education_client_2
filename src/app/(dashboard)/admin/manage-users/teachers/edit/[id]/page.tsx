import EditSellerComponent from '@/components/seller/editSeller';

export default function EditTeacher({ params }: any) {
  return (
    <div>
      <EditSellerComponent id={params?.id} />
    </div>
  );
}
