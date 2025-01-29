import CourseMaterialCom from '@/components/Course/Material/CourseMaterialCom';
import MilestoneMaterialCom from '@/components/milestone/Material/milestoneMaterialCom';

export default function MilestoneMaterialPace({
  params,
}: {
  params: { milestoneId: string };
}) {
  return (
    <div>
      <MilestoneMaterialCom milestoneId={params.milestoneId} />
    </div>
  );
}
