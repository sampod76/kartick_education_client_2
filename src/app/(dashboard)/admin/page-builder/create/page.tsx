/* eslint-disable prettier/prettier */
import PageBuilderCreateForm from '@/components/PageBuilder/PageBuilderCreateForm';

export default function PageBuilderEdit({ params }: { params: { id: string } }) {
  return (
    <div>
      <PageBuilderCreateForm id={params.id} />
    </div>
  );
}
