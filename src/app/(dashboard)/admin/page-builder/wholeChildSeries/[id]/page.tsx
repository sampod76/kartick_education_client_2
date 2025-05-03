import UniversalPageBuilderCom from '@/components/PageBuilder/universalPageBuilder';

export default function page({ params }: { params: { id: string } }) {
  return (
    <div>
      <UniversalPageBuilderCom id={params.id} />
    </div>
  );
}
