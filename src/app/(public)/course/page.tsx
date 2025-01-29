import Courses from '@/components/Home/coureses/Courses';
import React from 'react';

const CoursesPage = () => {
  return (
    <div className="mt-7">
      <h1 className="text-base font-normal">
        <Courses query={{}} />
      </h1>
    </div>
  );
};

export default CoursesPage;
