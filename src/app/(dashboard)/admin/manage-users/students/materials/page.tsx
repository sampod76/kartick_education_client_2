import StudentMaterial from '@/components/student/studentMaterial';
import React from 'react';

export default function StudentMaterialsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <StudentMaterial />
    </div>
  );
}
