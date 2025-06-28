import FlexAccreditedK12 from '@/components/PageBuilder/flexAccreditedK12PageBuilder';

export default function page({ params }: { params: { id: string } }) {
  return (
    <div>
      <FlexAccreditedK12 id={params.id} />
    </div>
  );
}
