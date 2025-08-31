'use client';
import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import CustomImageTag from '@/components/ui/CustomTag/CustomImageTag';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { ENUM_YN } from '@/constants/globalEnums';
import { useGetAllPurchaseAcceptedCourseQuery } from '@/redux/api/public/purchaseAPi';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { Pagination, PaginationProps } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function StudentDashboardMain() {
  const [current, setCurrent] = useState(1);
  const [pageCount, setPageCount] = useState(50);
  const { userInfo, userInfoLoading } = useGlobalContext();
  const {
    data: allPurchaseCourse,
    error: PurchaseCourseError,
    isLoading: PurchaseCourseLoading,
  } = useGetAllPurchaseAcceptedCourseQuery(
    {
      isDelete: ENUM_YN.NO,
      status: 'active',
      userId: userInfo?.id,
      page: current,
      limit: pageCount,
    },
    { skip: !Boolean(userInfo?.id) },
  );

  // console.log(allPurchaseCourse, 'allPurchaseCourse');

  // const {
  //   data: allPurchasePackage,
  //   error: allPurchasePackageError,
  //   isLoading: allPurchasePackageLoading,
  // } = useGetAllPackageAndCourseQuery(
  //   {
  //     isDelete: ENUM_YN.NO,
  //     status: 'active',
  //     user: userInfo?.id,
  //   },
  //   { skip: !Boolean(userInfo?.id) },
  // );

  // const {
  //   data: allSingleQuiz,
  //   error: allSingleQuizError,
  //   isLoading: allSingleQuizLoading,
  // } = useGetSubmitAllQuizQuery(
  //   {
  //     isDelete: ENUM_YN.NO,
  //     status: 'active',
  //     user: userInfo?.id,
  //   },
  //   { skip: !Boolean(userInfo?.id) },
  // );

  if (
    PurchaseCourseLoading ||
    userInfoLoading
    // allSingleQuizLoading ||
    // allPurchasePackageLoading
  ) {
    return <LoadingSkeleton />;
  }

  const CourseCard: React.FC<any> = ({ courseDetails }) => {
    return (
      <div className="m-4 h-full max-w-sm overflow-hidden rounded-2xl bg-white p-4 shadow-lg flex flex-col justify-between items-center py-5">
        <CustomImageTag
          className="h-48 w-full rounded-t-lg object-cover"
          src={fileObjectToLink(courseDetails?.image || courseDetails?.img)}
          alt={''}
          width={500}
          height={500}
        />
        <div className="p-4 text-center">
          <Link
            href={`/course/milestone/${courseDetails?._id}?categoryName=${
              courseDetails?.category?.title
            }&courseDetailsName=${courseDetails?.title}&category=${
              courseDetails?.category?._id || courseDetails?.category
            }`}
            className="mb-2 text-xl font-bold line-clamp-2"
          >
            {courseDetails?.title}
          </Link>

          <p className="text-base text-gray-700 line-clamp-2">
            <span className="font-semibold">{courseDetails?.category?.title}</span>
          </p>
        </div>
        <div className="mt-4 flex justify-center items-center gap-2">
          <Link
            href={`/course/milestone/${courseDetails?._id}?categoryName=${courseDetails?.categoryDetails?.title}&courseName=${courseDetails?.title}&courseName=${courseDetails._id}`}
          >
            <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
              View Course
            </button>
          </Link>
          <Link href={`/${userInfo?.role}/course/material/${courseDetails?._id}`}>
            <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-900">
              Material
            </button>
          </Link>
        </div>
      </div>
    );
  };
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setCurrent(current);
    setPageCount(pageSize);
  };

  const onChange: PaginationProps['onChange'] = (page) => {
    setCurrent(page);
  };
  return (
    <>
      {
        <div className="mx-auto min-h-screen w-full gap-2 p-4">
          <div className="relative top-0 z-10 col-span-12">
            {/* <Chart></Chart> */}
            {/* <AnimatePresenceWrapper>
              <div className="grid grid-cols-1 gap-4 text-[30px] sm:grid-cols-2 md:grid-cols-3 xl:gap-6">
                <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#4e36e2] p-4 text-white shadow">
                  <p className="rounded-md border-2 border-white p-1">
                    <FaUser className="h-7 w-7" />
                  </p>
                  <div className="space-y-2">
                    <p className="lggg:text-lg text-end text-base font-normal">
                      Total Purchase Course
                    </p>

                    <div className="text-end font-sans text-2xl font-bold">
                      <span>{allPurchaseCourse?.meta?.total || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#1ad588] p-4 text-white shadow">
                  <p className="rounded-md border-2 border-white p-1">
                    <GiBookCover className="h-7 w-7" />
                  </p>
                  <div className="space-y-2">
                    <p className="lggg:text-lg text-end text-base font-normal">
                      Total Purchase Package
                    </p>
                    <div className="text-end font-sans text-2xl font-bold">
                      <span>{allPurchasePackage?.meta?.total || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#1a97d5] p-4 text-white shadow">
                  <p className="rounded-md border-2 border-white p-1">
                    <GiBookCover className="h-7 w-7" />
                  </p>
                  <div className="space-y-2">
                    <p className="lggg:text-lg text-end text-base font-normal">
                      Total Submitted Quiz
                    </p>
                    <div className="text-end font-sans text-2xl font-bold">
                      <span>{allSingleQuiz?.meta?.total || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatePresenceWrapper> */}
          </div>
          <div>
            {allPurchaseCourse?.data?.length ? (
              <div className="mx-auto grid w-full h-full grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 my-2">
                {allPurchaseCourse?.data?.map((course: any) => (
                  <CourseCard key={course._id} courseDetails={course?.course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p className="my-2 text-center text-xl">No courses found</p>
                <Image
                  src={
                    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXF3MTlpOXI3MTBxNjN0NGJ1MThqeDVwYWNobTI3ZnB0eGl2a3JsbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUPGGDNsLvqsBOhuU0/giphy.gif'
                  }
                  width={900}
                  height={900}
                  alt=""
                  className="h-[85vh] w-full rounded-3xl"
                />
              </div>
            )}
            {/* {allPurchaseCourse?.data?.length ? (
              <div className="flex items-end justify-end bg-slate-200 p-1 text-2xl">
                <Pagination
                  showSizeChanger
                  current={current}
                  onChange={onChange}
                  showQuickJumper
                  onShowSizeChange={onShowSizeChange}
                  defaultCurrent={20}
                  total={allPurchaseCourse?.data?.meta?.total}
                  pageSizeOptions={[10, 20, 50]}
                />
              </div>
            ) : null} */}
          </div>
        </div>
      }
    </>
  );
}
