'use client';
import { toggleModal } from '@/redux/features/modalState';
import { useAppDispatch } from '@/redux/hooks';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';

const ModalComponent = ({
  children,
  buttonText,
  button,
  loading = false,
  width = 1000,
  maskClosable = true,
  modalId = 'sampleModalId',
}: {
  children: React.ReactElement;
  buttonText?: string;
  button?: any;
  loading?: boolean;
  width?: number;
  maskClosable?: boolean;
  modalId?: string;
}) => {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
    dispatch(toggleModal({ field: modalId, value: true }));
  };

  const handleCancel = () => {
    setOpen(false);
    dispatch(toggleModal({ field: modalId, value: false }));
  };

  return (
    <>
      {button ? (
        <div onClick={showModal}>{button}</div>
      ) : (
        <Button type="default" onClick={showModal}>
          {buttonText || 'Open Modal'}
        </Button>
      )}
      <Modal
        // title="Title"
        open={open}
        confirmLoading={loading}
        onCancel={handleCancel}
        //! when i went hidden ok and cancel button then it use
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {/* <Button>Custom Button</Button>
            <CancelBtn />
            <OkBtn /> */}
          </>
        )}
        maskClosable={maskClosable} // Prevent closing by clicking outside
        width={width}
      >
        {React.cloneElement(children, { open, setOpen })}
      </Modal>
    </>
  );
};

export default ModalComponent;
