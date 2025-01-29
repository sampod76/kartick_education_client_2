//@ts-nocheck
'use client';
import {
  useGetAllMilestoneQuery,
  useUpdateMilestoneSerialNumberMutation,
} from '@/redux/api/adminApi/milestoneApi';
import { useDebounced } from '@/redux/hooks';
import { ErrorModal, Success_model } from '@/utils/modalHook';
import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';

const MilestoneSerialUpdate = ({
  queryObject,
}: {
  queryObject?: { course: string; category?: string };
}) => {
  const [characters, updateCharacters] = useState<any[]>([]);

  function handleOnDragEnd(result: any) {
    if (!result.destination) return;
    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, {
      ...reorderedItem,
      indexNumber: result.source.index,
    });
    updateCharacters(items);
  }

  const { userInfo } = useGlobalContext();

  const [updateSerialNumber, { isLoading: Sloading }] =
    useUpdateMilestoneSerialNumberMutation();

  const query: Record<string, any> = {};

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(99999);
  const [sortBy, setSortBy] = useState<string>('milestone_number');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  query['status'] = 'active';
  query['category'] = queryObject?.category;
  query['course'] = queryObject?.course;

  if (userInfo?.role !== 'admin') {
    query['author'] = userInfo?.id;
  }

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }

  const { data = [], isLoading } = useGetAllMilestoneQuery({ ...query });

  const milestoneData = data?.data || [];
  useEffect(() => {
    if (milestoneData?.length) {
      updateCharacters(milestoneData);
    }
  }, [milestoneData]);

  const updateSerialNumberFunction = async () => {
    try {
      if (characters?.length === 0) {
        message.error('No milestone selected to update position');
        return;
      }
      const bodyData = characters.map((c, i) => {
        return { _id: c._id, number: i + 1 };
      });
      console.log(bodyData, 'bodyData');
      const res = await updateSerialNumber({ data: bodyData }).unwrap();
      Success_model('Successfully updated');
    } catch (error) {
      ErrorModal(error);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div
      style={{
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: '1rem',
        backgroundColor: 'white',
        padding: '1rem',
      }}
    >
      <div className="flex justify-between items-center px-3">
        <div></div>
        <h1 className="text-center m-2 ">Milestone Position Update</h1>
        <Button
          loading={Sloading}
          onClick={() => updateSerialNumberFunction()}
          className="!bg-blue-600 !text-white rounded-2xl !px-4 !py-2"
        >
          Update
        </Button>
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable type="group" droppableId="characters">
          {(provided) => (
            <div
              className="characters"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {characters.map(({ _id, title }: any, index: number) => (
                <Draggable key={_id} draggableId={_id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="shadow-md p-3 shadow-green-200 rounded-xl"
                    >
                      <p className="line-clamp-2">
                        {index + 1}. {title}
                      </p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default MilestoneSerialUpdate;
