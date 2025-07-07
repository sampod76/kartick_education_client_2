import { useGetAllPurchaseAcceptedCourseQuery } from '@/redux/api/public/purchaseAPi';
import { useAddMilestoneInPurchaseCourseMutation } from '@/redux/api/public/purchaseCourseApi';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { ErrorModal, Success_model } from '@/utils/modalHook';
import { Divider, Image as ImageAnt, Spin } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import AddMilestoneModal from './contentModal';

export default function AllContentList() {
  const [addMilestone, { isLoading: mLoading }] =
    useAddMilestoneInPurchaseCourseMutation();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const username = searchParams.get('user_name') as string;
  const email = searchParams.get('email') as string;
  const user_id = searchParams.get('user_id') as string;
  const { data, isLoading } = useGetAllPurchaseAcceptedCourseQuery({
    userId: user_id,
    status: 'active',
  });
  const allCourse = data?.data || [];
  console.log(allCourse, 'data');
  const handleQueryChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set(key, value);
    // router.push(`${path}?${currentParams.toString()}`);
    router.replace(`${path}?${currentParams.toString()}`);
  };
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
        user: user_id,
        packageToAdd: {
          packageId: '65b0ca7bee87699d456ede0b',
          purchasePackageId: '65b0ca7bee87699d456ede0b',
        },
      }).unwrap();
      // if (res._id) {
      // }
      Success_model('Milestones added successfully');
      setIsModalVisible(false);
      setSelectedMilestoneIds([]);
      setSelectedCourse(null);

      console.log('🚀 ~ handleModalOk ~ res:', res);
    } catch (error: any) {
      console.log('🚀 ~ handleModalOk ~ error:', error);
      ErrorModal(error?.message || 'Failed to save milestones. Please try again later.');
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold">All Content List</h1>
      <div className="border p-4 rounded-lg shadow-md bg-white">
        {/* <div className=" flex justify-center items-center border-4 border-white rounded-full overflow-hidden">
            <ImageAnt
              style={{
                height: '100px',
                width: '100px',
              }}
              src={fileObjectToLink(userData?.img)}
              alt="User mask"
            />
          </div> */}
        <h1 className="text-lg font-bold ">Name: {username || 'No Name Provided'}</h1>
        <h1 className="text-lg font-bold ">Email: {email}</h1>
      </div>
      <Divider className="my-4 border-2 border-black" />
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <Spin />
          ) : (
            allCourse?.map((purchaseCourse: any) => (
              <div
                key={purchaseCourse._id}
                className="flex items-center p-2 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
              >
                <div className="rounded-md overflow-hidden w-[60px] h-[60px] mb-2">
                  <ImageAnt
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    src={fileObjectToLink(purchaseCourse?.course?.img)}
                    alt={purchaseCourse.title}
                    preview={false}
                  />
                </div>

                <br />
                <div>
                  <div className="mx-2 text-sm font-semibold line-clamp-2">
                    {purchaseCourse?.course?.title}
                  </div>
                  <button
                    className="text-blue-500 mt-1 p-0 h-auto"
                    onClick={() => openMilestoneModal(purchaseCourse?.course)}
                  >
                    + Add Milestones (already added=
                    {(purchaseCourse?.permissionMilestones ?? []).length})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {isModalVisible && selectedCourse._id && user_id && (
          <AddMilestoneModal
            user={user_id}
            visible={isModalVisible}
            selectedCourse={selectedCourse}
            selectedMilestoneIds={selectedMilestoneIds}
            setSelectedMilestoneIds={setSelectedMilestoneIds}
            onClose={() => {
              setIsModalVisible(false);
              setSelectedMilestoneIds([]);
              setSelectedCourse(null);
            }}
            onSave={handleModalOk}
          />
        )}
      </div>
    </div>
  );
}
