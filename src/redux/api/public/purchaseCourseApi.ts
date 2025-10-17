import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { baseApi } from '../baseApi';

const PURCHASE_COURSE_URL = '/purchase_courses';

export const purchaseCoursesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCheckPurchasesCourse: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${PURCHASE_COURSE_URL}`,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.userPurchaseCourse],
    }),
    getCourseToAllMilestoneAndQuizzesCount: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${PURCHASE_COURSE_URL}/get-course-to-all-milestone-and-quizzes-count`,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: CoursePermission[], meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.userPurchaseCourse],
    }),

    milestoneGradebook: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${PURCHASE_COURSE_URL}/milestone-gradebook`,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.userPurchaseCourse],
    }),
    addSpatialConsiderCourse: build.mutation({
      query: (data: Record<string, any>) => {
        return {
          url: `${PURCHASE_COURSE_URL}` + '/spatial-consider-course',
          method: 'PUT',
          data,
        };
      },
      invalidatesTags: [tagTypes.student],
    }),
    addMilestoneInPurchaseCourse: build.mutation({
      query: (data: Record<string, any>) => {
        return {
          url: `${PURCHASE_COURSE_URL}` + '/add-milestone-by-course',
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [tagTypes.course],
    }),

    getCourseToAllMilestoneInPackage: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${PURCHASE_COURSE_URL}/` + 'get-course-to-all-milestone-in-package',
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.userPurchaseCourse, tagTypes.course],
    }),
    getStudentPurchaseCoursesToMilestoneModule: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${PURCHASE_COURSE_URL}/` + 'student-purchase-courses-to-milestone-module',
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.userPurchaseCourse, tagTypes.course],
    }),

    // update ac department
  }),
  overrideExisting: true,
});

export const {
  useGetCheckPurchasesCourseQuery,
  useAddSpatialConsiderCourseMutation,
  useAddMilestoneInPurchaseCourseMutation,
  useGetCourseToAllMilestoneInPackageQuery,
  useGetStudentPurchaseCoursesToMilestoneModuleQuery,
  useMilestoneGradebookQuery,
  useGetCourseToAllMilestoneAndQuizzesCountQuery,
} = purchaseCoursesApi;

export interface CoursePermission {
  _id: string;
  course: string;
  permissionMilestones: string[];
  packageToAdd: {
    packageId: string;
    purchasePackageId: string;
  };
  user: string;
  status: string;
  isDelete: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  permissionMilestonesDetails: {
    _id: string;
    title: string;
    imgs: string[];
    author: string;
    course: string;
    category: string;
    grade_level_id: string;
    status: string;
    isDelete: string;
    milestone_number: number;
    favorite: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalQuizzes: number;
    userTotalSubmits: number;
    userCorrectSubmits: number;
  }[];
}
