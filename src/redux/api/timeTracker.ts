import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { baseApi } from './baseApi';

const url = '/time-tracker';

export const TimeTrackersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllTimeTracker: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: url,
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
      providesTags: [tagTypes.TimeTracker],
    }),
    // get single academic department
    getSingleTimeTracker: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${url}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.TimeTracker],
    }),
    // create a new academic department
    addTimeTracker: build.mutation({
      query: (data) => ({
        url: url,
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.TimeTracker],
    }),
    // update ac department
    updateTimeTracker: build.mutation({
      query: (data) => ({
        url: `${url}/${data.id}`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.TimeTracker],
    }),

    // delete ac department
    deleteTimeTracker: build.mutation({
      query: (id) => ({
        url: `${url}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.TimeTracker],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddTimeTrackerMutation,
  useDeleteTimeTrackerMutation,
  useGetAllTimeTrackerQuery,
  useGetSingleTimeTrackerQuery,
  useUpdateTimeTrackerMutation,
} = TimeTrackersApi;
