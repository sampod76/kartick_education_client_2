import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { ILessonData } from '@/types/lessonType';
import { baseApi } from '../baseApi';

const LESSON_URL = '/lesson';

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllLesson: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: LESSON_URL,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: ILessonData[], meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.lesson],
    }),
    // get single academic department
    getSingleLesson: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${LESSON_URL}/${id}`,
          method: 'GET',
        };
      },
      providesTags: [tagTypes.lesson],
    }),
    // create a new academic department
    addLesson: build.mutation({
      query: (data) => {
        return {
          url: LESSON_URL,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [tagTypes.lesson, tagTypes.categoryChildren],
    }),
    // update ac department
    updateLesson: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${LESSON_URL}/${id}`,
          method: 'PATCH',
          data: data,
        };
      },
      invalidatesTags: [tagTypes.lesson, tagTypes.categoryChildren],
    }),
    updateLessonSerialNumber: build.mutation({
      query: ({ data }) => {
        return {
          url: `${LESSON_URL}/serialnumber-update`,
          method: 'PATCH',
          data: data,
        };
      },
      invalidatesTags: [tagTypes.milestone],
    }),

    // delete ac department
    deleteLesson: build.mutation({
      query: (id) => ({
        url: `${LESSON_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.lesson, tagTypes.categoryChildren],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddLessonMutation,
  useDeleteLessonMutation,
  useGetAllLessonQuery,
  useGetSingleLessonQuery,
  useUpdateLessonMutation,
  //
  useUpdateLessonSerialNumberMutation,
} = lessonApi;
