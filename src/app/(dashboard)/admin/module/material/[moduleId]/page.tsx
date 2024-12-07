import ModuleMaterialCom from '@/components/module/Material/ModuleMaterialCom';

export default function MilestoneMaterialPace({
  params,
}: {
  params: { moduleId: string };
}) {
  return (
    <div>
      <ModuleMaterialCom moduleId={params.moduleId} />
    </div>
  );
}
