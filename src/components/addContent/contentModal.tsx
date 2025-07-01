/* eslint-disable prettier/prettier */
import { useGetCourseToAllMilestoneInPackageQuery } from '@/redux/api/public/purchaseCourseApi';
import { Checkbox, Modal } from 'antd';
import React, { useEffect } from 'react';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';

interface AddMilestoneModalProps {
  visible: boolean;
  selectedCourse: any;
  selectedMilestoneIds: string[];
  user: string;
  setSelectedMilestoneIds: (ids: string[]) => void;
  onClose: () => void;
  onSave: () => void;
}

const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  visible,
  selectedCourse,
  user,
  selectedMilestoneIds,
  setSelectedMilestoneIds,
  onClose,
  onSave,
}) => {
  const { data, isLoading, isFetching } = useGetCourseToAllMilestoneInPackageQuery({
    course: selectedCourse?._id,
    user,
  });

  const permissionMilestones = data?.data?.length
    ? data?.data[0]?.permissionMilestones
    : [];

  // ⏳ On modal open, set default checked milestones
  useEffect(() => {
    if (visible && permissionMilestones?.length > 0) {
      setSelectedMilestoneIds(permissionMilestones);
    }
  }, [visible, permissionMilestones.length]);

  const handleMilestoneCheck = (milestoneId: string, checked: boolean) => {
    if (checked) {
      //@ts-ignore
      setSelectedMilestoneIds((prev: any) => [...prev, milestoneId]);
    } else {
      //@ts-ignore
      setSelectedMilestoneIds((prev: any[]) =>
        prev.filter((id: string) => id !== milestoneId),
      );
    }
  };

  if (isLoading || isFetching) {
    return <LoadingSkeleton />;
  }

  return (
    <Modal
      title={`Select Milestones for "${selectedCourse?.title}"`}
      open={visible}
      onOk={onSave}
      onCancel={onClose}
      okText="Save"
    >
      {selectedCourse?.milestones?.length > 0 ? (
        <div className="flex flex-col gap-2">
          {selectedCourse.milestones.map((milestone: any) => (
            <Checkbox
              key={milestone._id}
              checked={selectedMilestoneIds.includes(milestone._id)}
              onChange={(e) => handleMilestoneCheck(milestone._id, e.target.checked)}
            >
              {milestone.title}
            </Checkbox>
          ))}
        </div>
      ) : (
        <p>No milestones found for this course.</p>
      )}
    </Modal>
  );
};

export default AddMilestoneModal;
