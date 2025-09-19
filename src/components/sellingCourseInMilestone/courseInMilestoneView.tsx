'use client';

import fileObjectToLink from '@/utils/fileObjectToLink';
import Image from 'next/image';

type CourseSellingCardProps = {
  data: any;
  onBuy?: (id: string) => void;
};

export default function CourseSellingCard({ data, onBuy }: CourseSellingCardProps) {
  if (!data) return null;

  const { courseDetails, milestoneDetails, price, status, isStart } = data || {};

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={fileObjectToLink(courseDetails?.image || courseDetails?.img)}
          alt={courseDetails?.title || 'Course'}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        {/* Course Title */}
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {milestoneDetails?.title || 'N/A'}
        </h2>

        {/* Milestone Title */}
        <p className="text-sm text-gray-500  text-ellipsis">
          <span className="font-medium">
            {' '}
            ({courseDetails?.title || 'Untitled Course'})
          </span>
        </p>

        {/* Price */}
        <p className="text-xl font-bold text-green-600">${price ?? 0}</p>

        {/* Actions */}
        <button
          onClick={() => onBuy?.(data._id)}
          className="mt-2 w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          {isStart ? 'Continue Learning' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
}
