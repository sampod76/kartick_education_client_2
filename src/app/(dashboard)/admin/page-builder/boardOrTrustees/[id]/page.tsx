import BoardOfTrusteesCom from '@/components/PageBuilder/boardOfTrustees';

export default function BoardOrTrustees({ params }: { params: { id: string } }) {
  return (
    <div>
      <BoardOfTrusteesCom id={params.id} />
    </div>
  );
}
