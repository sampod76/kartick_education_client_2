'use client';
import React, { useState } from 'react';
// import TextEditor from "../shared/TextEditor/TextEditor";
import { ENUM_YN } from '@/constants/globalEnums';
import { removeNullUndefinedAndFalsey } from '@/hooks/removeNullUndefinedAndFalsey';
import {
  useAddResourceMutation,
  useGetAllResourceQuery,
  useUpdateResourceMutation,
} from '@/redux/api/adminApi/resourceApi';
import { Error_model_hook, Success_model } from '@/utils/modalHook';
import dynamic from 'next/dynamic';
import Form from '../Forms/Form';
import ButtonSubmitUI from '../ui/ButtonSubmitUI';
import ButtonLoading from '../ui/Loading/ButtonLoading';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
const TextEditor = dynamic(() => import('../shared/TextEditor/TextEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
    </div>
  ),
});

export default function ResourceCreate({
  setOpen,
  moduleId,
}: {
  moduleId: string;
  setOpen?: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [isReset, setIsReset] = useState(false);
  const [addResource, { isLoading }] = useAddResourceMutation();
  const [updateResource, { isLoading: updateLoading }] = useUpdateResourceMutation();
  const query: Record<string, any> = {};
  query['limit'] = 1;
  query['module'] = moduleId;
  query['isDelete'] = ENUM_YN.NO;

  const { data, isLoading: GetLoading } = useGetAllResourceQuery(query);
  const resource = data?.data[0];
  console.log('🚀 ~ resource:', resource);
  const onSubmit = async (values: any) => {
    removeNullUndefinedAndFalsey(values);

    if (!moduleId) {
      Error_model_hook('Please ensure your are selected moduleId');
      return;
    }
    const resourceData: object = {
      ...values,
      module: moduleId,
    };
    console.log(resourceData);
    // return;
    try {
      let res;
      if (!resource) {
        res = await addResource(resourceData).unwrap();
      } else {
        res = await updateResource({ id: resource?._id, data: resourceData }).unwrap();
      }
      if (res?.success == false) {
        Error_model_hook(res?.message);
      } else {
        Success_model(`Successfully ${resource ? 'Update' : 'added'} Resource`);
        // if (setOpen) {
        //   setOpen(false);
        // }
        if (!resource) {
          setIsReset(true);
        }
      }
    } catch (error: any) {
      Error_model_hook(error?.message);
      console.log(error);
    }
  };

  if (GetLoading) {
    return <LoadingSkeleton />;
  }
  return (
    <Form submitHandler={onSubmit}>
      <TextEditor defaultTextEditorValue={resource?.details || ''} isReset={isReset} />
      <div className="w-fit mx-auto">
        {isLoading || updateLoading ? (
          <ButtonLoading />
        ) : (
          <ButtonSubmitUI>{resource ? 'Update' : 'Create Resource'}</ButtonSubmitUI>
        )}
      </div>
    </Form>
  );
}
