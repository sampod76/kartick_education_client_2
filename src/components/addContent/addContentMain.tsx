'use client';
import { useGetAllCourseQuery } from '@/redux/api/adminApi/courseApi';
import { useGetSingleStudentQuery } from '@/redux/api/adminApi/moderatorApi';
import { useAddMilestoneInPurchaseCourseMutation } from '@/redux/api/public/purchaseCourseApi';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { ErrorModal, Success_model } from '@/utils/modalHook';
import { Divider, Image as ImageAnt, Spin } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FilterCategorySelect from '../dashboard/Filter/FilterCategory';
import LoadingForDataFetch from '../Utlis/LoadingForDataFetch';
import AddMilestoneModal from './contentModal';
export default function AddContentMain() {
  const [addMilestone, { isLoading }] = useAddMilestoneInPurchaseCourseMutation();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<string[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterValue, setFilterValue] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const category = searchParams.get('category');
  const handleQueryChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set(key, value);
    // router.push(`${path}?${currentParams.toString()}`);
    router.replace(`${path}?${currentParams.toString()}`);
  };
  const id = searchParams.get('user_id') as string;
  const { data: userData, isLoading: loading } = useGetSingleStudentQuery(id);
  const {
    data: AllCourse,
    isLoading: cLoading,
    isFetching: cFetching,
  } = useGetAllCourseQuery(
    {
      limit: 999999,
      category: category || filterValue,
      sortBy: 'showing_number',
      sortOrder: 'asc',
      status: 'active',
      isMilestoneList: 'yes',
      needProperty: 'isMilestoneList',
    },
    { skip: !Boolean(filterValue) },
  );

  useEffect(() => {
    handleQueryChange('category', filterValue);
  }, [filterValue]);
  if (loading || cLoading) {
    return <LoadingForDataFetch />;
  }
  const openMilestoneModal = (course: any) => {
    setSelectedCourse(course);
    setSelectedMilestoneIds([]); // 🔸 No pre-selected milestones
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      console.log('Selected Milestones:', selectedMilestoneIds);

      const res = await addMilestone({
        course: selectedCourse._id,
        permissionMilestones: selectedMilestoneIds,
        user: id,
        packageToAdd: {
          packageId: '65b0ca7bee87699d456ede0b',
          purchasePackageId: '65b0ca7bee87699d456ede0b',
        },
      }).unwrap();
      if (res._id) {
        Success_model('Milestones added successfully');
        setIsModalVisible(false);
      }
      console.log('🚀 ~ handleModalOk ~ res:', res);
    } catch (error: any) {
      console.log('🚀 ~ handleModalOk ~ error:', error);
      ErrorModal(error?.message || 'Failed to save milestones. Please try again later.');
    }
  };
  return (
    <div>
      <div className="flex items-start justify-center gap-4">
        <div>
          <h1 className="text-2xl font-bold my-3">Please select a category</h1>
          {/* Add your content here */}
          <FilterCategorySelect
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
        </div>
        <div className="border p-4 rounded-lg shadow-md bg-white">
          <div className=" flex justify-center items-center border-4 border-white rounded-full overflow-hidden">
            <ImageAnt
              style={{
                height: '100px',
                width: '100px',
              }}
              src={fileObjectToLink(userData?.img)}
              alt="User mask"
            />
          </div>
          <h1 className="text-lg font-bold ">
            Name: {userData?.name?.firstName} {userData?.name?.lastName}
          </h1>
          <h1 className="text-lg font-bold ">Email: {userData?.email}</h1>
        </div>
      </div>
      <Divider className="my-4 border-2 border-black" />
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cLoading || cFetching ? (
            <Spin />
          ) : (
            AllCourse?.data?.map((course: any) => (
              <div
                key={course._id}
                className="flex  items-center p-2 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
              >
                <div className="rounded-md overflow-hidden w-[60px] h-[60px] mb-2">
                  <ImageAnt
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    src={fileObjectToLink(course?.img)}
                    alt={course.title}
                    preview={false}
                  />
                </div>

                <br />
                <div>
                  <div className=" mx-2 text-sm font-semibold line-clamp-2">
                    {course.title}
                  </div>
                  <button
                    // type="primary"
                    className="text-blue-500  mt-1 p-0 h-auto"
                    onClick={() => openMilestoneModal(course)}
                  >
                    + Add Milestones (total={course?.milestones?.length})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <AddMilestoneModal
          user={id}
          visible={isModalVisible}
          selectedCourse={selectedCourse}
          selectedMilestoneIds={selectedMilestoneIds}
          setSelectedMilestoneIds={setSelectedMilestoneIds}
          onClose={() => setIsModalVisible(false)}
          onSave={handleModalOk}
        />
      </div>
    </div>
  );
}
