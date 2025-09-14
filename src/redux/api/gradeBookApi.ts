import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { baseApi } from './baseApi';
export interface RootReport {
  _id: string;
  totalCompleted: number;
  avgRatio: number;
  lessons: Lesson[];
  milestoneId: string;
  milestoneTitle: string;
}

interface Lesson {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCompletedContentRatio: number;
  totalCompletedNumber: number;
}

const URL = '/grade-books';

export const gradeBookApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllGradeBook: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: URL,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: IGradeBook[], meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.greadBook],
    }),
    getAllGradeBookReport: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${URL}/gradebook-report`,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: RootReport[], meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.greadBook],
    }),
    // get single academic department
    getSingleGradeBook: build.query<IGradeBook, string | string[] | undefined>({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IGradeBook) => response,
      providesTags: [tagTypes.greadBook],
    }),
    // create a new academic department
    addGradeBook: build.mutation({
      query: (data) => ({
        url: URL,
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.greadBook],
    }),
    // update ac department
    updateGradeBook: build.mutation({
      query: (data) => ({
        url: `${URL}/${data.id}`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.greadBook],
    }),

    // delete ac department
    deleteGradeBook: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.greadBook],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddGradeBookMutation,
  useDeleteGradeBookMutation,
  useGetAllGradeBookQuery,
  useGetSingleGradeBookQuery,
  useUpdateGradeBookMutation,
  useGetAllGradeBookReportQuery,
} = gradeBookApi;
