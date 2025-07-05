import { useGetAllPurchaseAcceptedCourseQuery } from '@/redux/api/public/purchaseAPi';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { Divider, Image as ImageAnt, Spin } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AddMilestoneModal from './contentModal';
import { useState } from 'react';

export default function AllContentList() {
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
            data?.data?.map((course: any) => (
              <div
                key={course._id}
                className="flex items-center p-2 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
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
                  <div className="mx-2 text-sm font-semibold line-clamp-2">
                    {course.title}
                  </div>
                  <button
                    className="text-blue-500 mt-1 p-0 h-auto"
                    onClick={() => openMilestoneModal(course)}
                  >
                    + Add Milestones (total={(course?.milestones ?? []).length})
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
