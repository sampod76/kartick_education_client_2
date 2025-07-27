import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { baseApi } from '../baseApi';

const URL = '/certificate';

export const certificateApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllCerfyme: build.query({
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
      providesTags: [tagTypes.Cerfyme],
    }),
    // get single academic department
    getSingleCerfyme: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${URL}/${id}`,
          method: 'GET',
        };
      },
      providesTags: [tagTypes.Cerfyme],
    }),

    // create a new academic department
    addCerfyme: build.mutation({
      query: (data) => {
        return {
          url: URL,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [tagTypes.Cerfyme],
    }),
    // update ac department

    // delete ac department
    deleteCerfyme: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.Cerfyme],
    }),
  }),
  overrideExisting: true,
});

export const { useAddCerfymeMutation } = certificateApi;
