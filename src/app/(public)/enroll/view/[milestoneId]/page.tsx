'use client';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { useGetSingleMilestoneQuery } from '@/redux/api/adminApi/milestoneApi';
import { IMilestoneData } from '@/types/miestoneType';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { Button } from 'antd';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import parse from 'html-react-parser';
import { useAddStripeMilestonePaymentMutation } from '@/redux/api/public/paymentApi';
import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import { Error_model_hook } from '@/utils/modalHook';
export default function MilestoneView({ params }: { params: { milestoneId: string } }) {
  const { userInfo } = useGlobalContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const price = searchParams.get('p');
  const { data, isLoading } = useGetSingleMilestoneQuery(params.milestoneId);
  const [purcheseMilesion, { isLoading: isAdding }] =
    useAddStripeMilestonePaymentMutation();

  const milestoneDetails = data as IMilestoneData;
  const courseDetails = data?.course;

  if (isLoading) {
    return (
      <div>
        <LoadingSkeleton />
      </div>
    );
  }
  const makePayment = async (platform?: string) => {
    if (!userInfo?.id) {
      window.open('/login', '_blank');
      return;
    }

    try {
      const res = await purcheseMilesion({
        products: [
          {
            // "name": "sampod",
            // "img": "https://images.pexels.com/photos/335257/pexels-photo-335257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            // "price": 120,
            // "quantity": 1,
            milestoneId: milestoneDetails?._id,
          },
        ],
      }).unwrap();

      if (res?.url) {
        router.push(res.url as string);
      }
    } catch (error: any) {
      console.log('🚀 ~ makePayment ~ error:', error);
      Error_model_hook(error?.message || 'Something is wrong');
    }
  };

  return (
    <div className="mt-10 container mx-auto p-5 bg-white rounded-2xl shadow-2xl shadow-purple-500">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          {/* Image */}
          <div className="relative h-48 w-full">
            <Image
              src={fileObjectToLink(
                milestoneDetails?.imgs[0] || courseDetails?.image || courseDetails?.img,
              )}
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
            <Button
              onClick={() => makePayment()}
              className="mt-2 w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition text-center"
            >
              {'Purchase'}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mt-5">Description</h1>
        <p className="text-gray-600 mt-2">{milestoneDetails?.short_description}</p>
        <div className="my-3 line-clamp-3 text-center text-base lg:text-xl">
          {milestoneDetails?.details
            ? parse(milestoneDetails?.details)
            : milestoneDetails?.short_description}
        </div>
      </div>
    </div>
  );
}
