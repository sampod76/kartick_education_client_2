import InternelError from '@/components/shared/Error/InternelError';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import NotFoundCourse from '@/components/ui/NotFound/NotFoundCourse';
import { ENUM_SORT_ORDER, ENUM_STATUS } from '@/constants/globalEnums';
import { useGetAllCourseQuery } from '@/redux/api/adminApi/courseApi';
import { useDebounced } from '@/redux/hooks';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Pagination, PaginationProps } from 'antd';
import { useEffect, useState } from 'react';
import SIngleCourse from './SIngleCourse';

interface ICourseItemType {
  status?: string;
  category?: string;
  categoryTitle?: string;
  [key: string]: string | undefined;
}

const Courses = ({
  query,
  width = 'container',
}: {
  query: ICourseItemType;
  width?: string;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [current, setCurrent] = useState(1);
  const [pageCount, setPageCount] = useState(12);
  const [category, setCategory] = useState('');

  // Function to render courses for the current page
  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  } else if (searchTerm === '') {
    query['searchTerm'] = '';
  }
  console.log('🚀 ~ searchTerm:', query);
  // Fetch courses based on query parameters and pagination
  const { data, isLoading, isFetching, error } = useGetAllCourseQuery({
    status: ENUM_STATUS.ACTIVE,
    page: current,
    limit: pageCount,
    sortOrder: ENUM_SORT_ORDER.ASC,
    category,
    ...query,
  });
  const courseData = data?.data || [];
  // console.log('🚀 ~ courseData:', courseData);

  const totalCourses = courseData.length;

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setCurrent(current);
    setPageCount(pageSize);
  };

  const onChange: PaginationProps['onChange'] = (page) => {
    setCurrent(page);
  };

  useEffect(() => {
    if (query?.category) {
      setCategory(query?.category);
    } else {
      setCategory('');
    }
  }, [query?.category]);

  if (error) {
    return (
      <InternelError
        message={
          //@ts-ignore
          error.data || data?.data?.message
        }
      />
    );
  }
  const resetFilters = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <div
        className={`container mx-auto flex items-center justify-center `}
        title="blog List"
      >
        <Input
          size="middle"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            // width: '250px',
            marginTop: '-8px',
          }}
          className="!bg-opacity-45 !w-[70%] ring-2 ring-cyan-800 "
        />
        <div>
          {!!searchTerm && (
            <Button style={{ margin: '0px 5px' }} type="default" onClick={resetFilters}>
              <ReloadOutlined />
            </Button>
          )}
        </div>
      </div>
      {isLoading || isFetching ? (
        <LoadingSkeleton sectionNumber={5} />
      ) : totalCourses === 0 ? (
        <NotFoundCourse />
      ) : (
        <div
          className={`mt-1 ${
            width === 'container' ? 'container' : 'w-full'
          } mx-auto p-2 backdrop-blur-xl`}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {courseData.map((course) => (
              <SIngleCourse key={course._id} course={course} />
            ))}
          </div>
          <div
            className={`mb-2 mt-10 flex items-center justify-center rounded-md bg-gray-200 p-2`}
          >
            <div className="flex items-end justify-end bg-slate-200 p-1 text-2xl">
              <Pagination
                showSizeChanger
                current={current}
                onChange={onChange}
                showQuickJumper
                onShowSizeChange={onShowSizeChange}
                defaultCurrent={1}
                total={data?.meta?.total}
                pageSizeOptions={[10, 20, 50]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
