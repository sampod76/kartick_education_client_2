import UniversalPageBuilderCom from '@/components/PageBuilder/universalPageBuilder';

export default function InclusionApproach({ params }: { params: { id: string } }) {
  return (
    <div>
      <UniversalPageBuilderCom id={params.id} />
    </div>
  );
}
