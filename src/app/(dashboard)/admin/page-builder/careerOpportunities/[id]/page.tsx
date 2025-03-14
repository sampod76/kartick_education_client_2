import BoardOfTrusteesCom from '@/components/PageBuilder/boardOfTrustees';
import UniversalPageBuilderCom from '@/components/PageBuilder/universalPageBuilder';

export default function CareerOpportunities({ params }: { params: { id: string } }) {
  return (
    <div>
      <UniversalPageBuilderCom id={params.id} />
    </div>
  );
}
