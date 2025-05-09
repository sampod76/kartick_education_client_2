import QuizMaterialCom from '@/components/Quiz/Material/quizMaterialCom';

export default function QuizMaterial({ params }: { params: { quizId: string } }) {
  return (
    <div>
      <QuizMaterialCom quizId={params.quizId} />
    </div>
  );
}
