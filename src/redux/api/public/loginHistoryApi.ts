/* eslint-disable @typescript-eslint/no-explicit-any */
// import { tagTypes.LoginHistoryg-types";
import { IMeta } from '@/types';
import { baseApi } from '../baseApi';
import { tagTypes } from '@/redux/tag-types';

const LOGIN_HISTORY = '/login_history';

export const loginHistoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllLoginHistory: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: LOGIN_HISTORY,
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
      providesTags: [tagTypes.LoginHistory],
    }),
    // get single academic department
    getSingleLoginHistory: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${LOGIN_HISTORY}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.LoginHistory],
    }),

    // delete ac department
    deleteLoginHistory: build.mutation({
      query: (id) => ({
        url: `${LOGIN_HISTORY}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.LoginHistory],
    }),
  }),
  overrideExisting: true,
});

export const {
  useDeleteLoginHistoryMutation,
  useGetAllLoginHistoryQuery,
  useGetSingleLoginHistoryQuery,
} = loginHistoryApi;
