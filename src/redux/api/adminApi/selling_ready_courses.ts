/* eslint-disable prettier/prettier */
// import { tagTypes.sellingReadyCourseg-types";
import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';

import { baseApi } from '../baseApi';

const URL = '/selling-ready-courses';

export const sellingReadyCourseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllSellingReadyCourse: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: URL,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: SellingReadyCourse[], meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.sellingReadyCourse],
    }),

    // get single academic department
    getSingleSellingReadyCourse: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${URL}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: SellingReadyCourse) => {
        return response;
      },
      providesTags: [tagTypes.sellingReadyCourse],
    }),

    // create a new academic department
    addSellingReadyCourse: build.mutation({
      query: (data) => ({
        url: URL,
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.sellingReadyCourse, tagTypes.categoryChildren],
    }),
    // update ac department
    updateSellingReadyCourse: build.mutation({
      query: ({ data, id }) => ({
        url: `${URL}/${id}`,
        method: 'PATCH',
        data: data,
      }),
      invalidatesTags: [tagTypes.sellingReadyCourse],
    }),

    // delete ac department
    deleteSellingReadyCourse: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.sellingReadyCourse],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddSellingReadyCourseMutation,
  useDeleteSellingReadyCourseMutation,
  useGetAllSellingReadyCourseQuery,
  useGetSingleSellingReadyCourseQuery,
  useUpdateSellingReadyCourseMutation,
} = sellingReadyCourseApi;

export interface SellingReadyCourse {
  _id: string;
  price: number;
  category_id: string;
  course_id: string;
  milestone_id: string;
  isStart: boolean;
  status: string;
  isDelete: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  courseDetails: CourseDetails;
  milestoneDetails: MilestoneDetails;
}

export interface CourseDetails {
  _id: string;
  title: string;
  img: string;
  image: Image;
  category: string;
}

export interface Image {
  url: string;
  mimetype: string;
  filename: string;
  path: string;
  cdn: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneDetails {
  _id: string;
  title: string;
  imgs: Img[];
  author: string;
  course: string;
  category: string;
  grade_level_id: string;
  status: string;
  isDelete: string;
  milestone_number: number;
  favorite: string;
  tags: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Img {
  url: string;
  mimetype: string;
  filename: string;
  path: string;
  cdn: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
}
