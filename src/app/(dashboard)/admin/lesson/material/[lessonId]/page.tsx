import LessonMaterialCom from '@/components/lesson/Material/lessonMaterialCom';

export default function LessonMaterial({ params }: { params: { lessonId: string } }) {
  return (
    <div>
      <LessonMaterialCom lessonId={params.lessonId} />
    </div>
  );
}
