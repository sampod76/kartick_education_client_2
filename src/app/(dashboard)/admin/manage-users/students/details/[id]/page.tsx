'use client';

import StudentProfileView from '@/components/userView/studentProfileView';

const StudentDetailsPage = ({ params }: any) => {
  const id = params.id;

  return <StudentProfileView id={id} />;
};

export default StudentDetailsPage;
