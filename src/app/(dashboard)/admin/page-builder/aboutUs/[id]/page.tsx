import AboutUsCom from '@/components/PageBuilder/aboutUs';

export default function AboutUs({ params }: { params: { id: string } }) {
  return (
    <div>
      <AboutUsCom id={params.id} />
    </div>
  );
}
