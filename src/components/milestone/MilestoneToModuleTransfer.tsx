/* eslint-disable prettier/prettier */
//@ts-nocheck
'use client';
import { useGetAllMilestoneQuery } from '@/redux/api/adminApi/milestoneApi';
import {
  useGetAllModuleQuery,
  useUpdateModuleTransferMutation,
} from '@/redux/api/adminApi/moduleApi';
import { useDebounced } from '@/redux/hooks';
import { confirm_modal, Error_model_hook, Success_model } from '@/utils/modalHook';
import { Button, Divider, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';

const MilestoneToModuleTransfer = ({
  queryObject,
}: {
  queryObject?: { course: string; category?: string };
}) => {
  const [form, setForm] = useState();
  const [to, setTo] = useState();
  const { userInfo } = useGlobalContext();
  const [todoItems, setTodoItems] = useState<any[]>([]);
  const [doneItems, setDoneItems] = useState([]);
  // Handle drag end event
  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // If dropped outside a valid droppable
    if (!destination) return;

    // Avoid no-op moves
    if (source.droppableId === destination.droppableId) {
      return;
    }
    if (!to) {
      message.error('Please select to milestone');
      return;
    }

    // Define source and destination lists
    const sourceList = source.droppableId === 'todo' ? [...todoItems] : [...doneItems];
    const setSourceList = source.droppableId === 'todo' ? setTodoItems : setDoneItems;

    const destinationList =
      destination.droppableId === 'todo' ? [...todoItems] : [...doneItems];
    const setDestinationList =
      destination.droppableId === 'todo' ? setTodoItems : setDoneItems;

    // Remove the item from the source list
    const [movedItem] = sourceList.splice(source.index, 1);

    // Add the item to the destination list at the correct position
    destinationList.splice(destination.index, 0, movedItem);

    // Update both source and destination states
    setSourceList(sourceList);
    setDestinationList(destinationList);
  };

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

  const { data, isLoading, isFetching } = useGetAllMilestoneQuery({ ...query });
  const milestoneData = data?.data || [];
  //************module query********* */
  const moduleQuery: any = {};
  moduleQuery['milestone'] = form;
  moduleQuery['limit'] = 1000;
  moduleQuery['page'] = page;
  moduleQuery['sortBy'] = 'module_number';
  moduleQuery['sortOrder'] = 'asc';
  const {
    data: modulesServerData,
    isLoading: mloading,
    isFetching: mFetching,
  } = useGetAllModuleQuery(moduleQuery, {
    skip: !Boolean(form),
  });

  const moduleData = modulesServerData?.data || [];
  const [moduleTransfer, { isLoading: tloading }] = useUpdateModuleTransferMutation();
  const handleTransfer = (id: string) => {
    confirm_modal(`Are you sure you want to transfer`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const updateData = doneItems.map((module) => ({
            _id: module._id,
            milestone: to,
          }));
          const res = await moduleTransfer({ data: updateData }).unwrap();
          Success_model('Successfully transferred');
          setDoneItems([]);
        } catch (error: any) {
          Error_model_hook(error.message);
        }
      }
    });
  };
  //************end ********* */

  useEffect(() => {
    if (moduleData) {
      setTodoItems(moduleData);
    }
  }, [mloading, mFetching, to, form]);
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <div className="flex justify-end ">
        <Button
          disabled={!to || doneItems?.length == 0}
          type="primary"
          className=""
          onClick={() => handleTransfer()}
          loading={tloading}
        >
          Transfer
        </Button>
      </div>
      <div className="flex gap-10 p-5">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* To Do Box */}
          <Droppable droppableId="todo">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-4 rounded shadow w-[50%]"
              >
                <div className="flex items-center gap-1 mb-3">
                  <h3 className="text-lg font-bold mb-3">Form:</h3>
                  <Select
                    size="large"
                    // onChange={handleChange ? handleChange : onChange}
                    onChange={(val) => {
                      setForm(val);
                      setDoneItems([]);
                    }}
                    options={milestoneData
                      .filter((f) => f._id !== to)
                      .map((item) => ({
                        label: item.milestone_number + ' : ' + item?.title,
                        value: item?._id,
                      }))}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    loading={isLoading}
                    //   allowClear
                    placeholder={'Please select which milestone from transfer'}
                    className="!mb-3"
                  />
                </div>
                <Divider />
                {mloading ? (
                  <LoadingSkeleton />
                ) : (
                  todoItems?.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
                        >
                          {item.module_number} : {item?.title}
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Done Box */}
          <Droppable droppableId="done">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-green-100 p-4 rounded shadow w-[50%]"
              >
                <div className="flex items-center gap-1 mb-3">
                  <h3 className="text-lg font-bold mb-3">To:</h3>
                  <Select
                    size="large"
                    // onChange={handleChange ? handleChange : onChange}
                    onChange={(val) => {
                      setTo(val);
                      setDoneItems([]);
                    }}
                    options={milestoneData
                      .filter((f) => f._id !== form)
                      .map((item) => ({
                        label: item.milestone_number + ' : ' + item?.title,
                        value: item?._id,
                      }))}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    loading={isLoading}
                    //   allowClear
                    placeholder={'Please select to milestone'}
                    className="!mb-3"
                  />
                </div>
                {doneItems?.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
                      >
                        {item.module_number} : {item?.title}
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
    </div>
  );
};

export default MilestoneToModuleTransfer;
