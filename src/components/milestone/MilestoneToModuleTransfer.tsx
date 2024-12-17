/* eslint-disable prettier/prettier */
//@ts-nocheck
'use client';
import { useGetAllMilestoneQuery } from '@/redux/api/adminApi/milestoneApi';
import { useGetAllModuleQuery } from '@/redux/api/adminApi/moduleApi';
import { useDebounced } from '@/redux/hooks';
import { Divider, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';

const MilestoneToModuleTransfer = ({
  queryObject,
}: {
  queryObject?: { course: string; category?: string };
}) => {
  const [to, setTo] = useState();

  const [form, setForm] = useState();
  console.log('🚀 ~ form:', form);
  const { userInfo } = useGlobalContext();
  const [todoItems, setTodoItems] = useState<any[]>([]);
  //   console.log('🚀 ~ todoItems:', todoItems);
  const [doneItems, setDoneItems] = useState([]);
  console.log('🚀 ~ doneItems:', doneItems);

  // Handle drag end event
  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    // Do nothing if dropped outside a valid droppable
    if (!destination) return;
    if (!form) {
      message.error('Please select form milestone');
      return;
    }
    // Determine source and destination lists
    const sourceList = source.droppableId === 'todo' ? [...todoItems] : [...doneItems];
    const setSourceList = source.droppableId === 'todo' ? setTodoItems : setDoneItems;
    const destinationList =
      destination.droppableId === 'todo' ? [...todoItems] : [...doneItems];
    const setDestinationList =
      destination.droppableId === 'todo' ? setTodoItems : setDoneItems;
    // Remove item from source list
    const [movedItem] = sourceList.splice(source.index, 1);
    // Add item to destination list at the correct index
    destinationList.splice(destination.index, 0, movedItem);
    // Update state immutably
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
  const moduleQuery: any = {};
  moduleQuery['milestone'] = to;
  moduleQuery['limit'] = 1000;
  moduleQuery['page'] = page;
  moduleQuery['sortBy'] = 'module_number';
  moduleQuery['sortOrder'] = 'asc';
  const {
    data: modulesServerData,
    isLoading: mloading,
    isFetching: mFetching,
  } = useGetAllModuleQuery(moduleQuery, {
    skip: !Boolean(to),
  });

  const moduleData = modulesServerData?.data || [];
  //   console.log('🚀 ~ moduleData:', moduleData);

  const milestoneData = data?.data || [];
  useEffect(() => {
    if (moduleData) {
      setTodoItems(moduleData);
    }
  }, [mloading, mFetching, to, form]);
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  //   console.log('🚀 ~ milestoneData:', milestoneData);

  return (
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
                  placeholder={'Please select which milestone to transfer'}
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
                  placeholder={'Please select from milestone'}
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
  );
};

export default MilestoneToModuleTransfer;
