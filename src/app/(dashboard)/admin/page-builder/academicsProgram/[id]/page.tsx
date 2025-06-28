import FlexAccreditedK12 from '@/components/PageBuilder/flexAccreditedK12PageBuilder';

export default function AcademicsProgram({ params }: { params: { id: string } }) {
  return (
    <div>
      <FlexAccreditedK12 id={params.id} />
    </div>
  );
}
