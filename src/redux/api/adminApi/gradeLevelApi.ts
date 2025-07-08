import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { baseApi } from '../baseApi';

const URL = '/grade-level';

export const gradeLevelApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllGradeLevel: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: URL,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: any[], meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.GradeLevel],
    }),
    // get single academic department
    getSingleGradeLevel: build.query({
      query: (id: string | string[] | undefined) => {
        // console.log(id);
        return {
          url: `${URL}/${id}`,
          method: 'GET',
        };
      },
      providesTags: [tagTypes.GradeLevel],
    }),
    // create a new academic department
    addGradeLevel: build.mutation({
      query: (data) => {
        //// console.log(data, "cacccc");

        return {
          url: URL,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [tagTypes.GradeLevel],
    }),
    // update ac department
    updateGradeLevel: build.mutation({
      query: ({ data, id }) => {
        //// console.log(data, "GradeLevel data");
        return {
          url: `${URL}/${id}`,
          method: 'PATCH',
          data: data,
        };
      },
      invalidatesTags: [tagTypes.GradeLevel],
    }),
    // delete ac department
    deleteGradeLevel: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.GradeLevel],
    }),
    updateGradeLevelSerialNumber: build.mutation({
      query: ({ data }) => {
        return {
          url: `${URL}/serialnumber-update`,
          method: 'PATCH',
          data: data,
        };
      },
      invalidatesTags: [tagTypes.GradeLevel],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddGradeLevelMutation,
  useDeleteGradeLevelMutation,
  useGetAllGradeLevelQuery,
  useGetSingleGradeLevelQuery,
  useUpdateGradeLevelMutation,
  //
  useUpdateGradeLevelSerialNumberMutation,
} = gradeLevelApi;
