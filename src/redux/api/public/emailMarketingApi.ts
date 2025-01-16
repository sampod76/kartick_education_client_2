/* eslint-disable prettier/prettier */
import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { baseApi } from '../baseApi';

const URL = '/email-marketing';

export const emailMarketingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllEmailMarketing: build.query({
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
      providesTags: [tagTypes.EmailMarketing],
    }),

    // get single academic department
    getSingleEmailMarketing: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${URL}/${id}`,
          method: 'GET',
        };
      },
      providesTags: [tagTypes.EmailMarketing],
    }),
    // create a new academic department
    addEmailMarketing: build.mutation({
      query: (data) => {
        //
        return {
          url: URL,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [tagTypes.EmailMarketing],
    }),
    // update ac department
    updateEmailMarketing: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${URL}/${id}`,
          method: 'PATCH',
          data: data,
        };
      },
      invalidatesTags: [tagTypes.EmailMarketing],
    }),

    // delete ac department
    deleteEmailMarketing: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.EmailMarketing],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddEmailMarketingMutation,
  useDeleteEmailMarketingMutation,
  useGetAllEmailMarketingQuery,
  useGetSingleEmailMarketingQuery,
  useUpdateEmailMarketingMutation,
} = emailMarketingApi;
