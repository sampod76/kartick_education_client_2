import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { baseApi } from '../baseApi';

const APP_URL = '/friend-ship';

export const allFriendShipApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllFriendShipes: build.query({
      query: (arg) => {
        return {
          url: APP_URL,
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
      providesTags: [tagTypes.FriendShip],
    }),

    getSingleFriendShip: build.query({
      query: (id) => {
        return {
          url: `${APP_URL}/${id}`,
          method: 'GET',
        };
      },
      providesTags: [tagTypes.FriendShip],
    }),

    addFriendShip: build.mutation({
      query: (data) => {
        return {
          url: APP_URL,
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: [tagTypes.FriendShip],
    }),
    getCheckUserIdToExistFriendShip: build.query({
      query: (id) => {
        return {
          url: APP_URL + '/check-userid-to-exist-friendship' + `/${id}`,
          method: 'GET',
        };
      },
      providesTags: [tagTypes.FriendShip],
    }),

    updateFriendShip: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${APP_URL}/${id}`,
          method: 'PATCH',
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: [tagTypes.FriendShip],
    }),

    deleteFriendShip: build.mutation({
      query: (id) => ({
        url: `${APP_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.FriendShip],
    }),
  }),
});

export const {
  useAddFriendShipMutation,
  useDeleteFriendShipMutation,
  useGetAllFriendShipesQuery,
  useGetSingleFriendShipQuery,
  useUpdateFriendShipMutation,
  //
  useGetCheckUserIdToExistFriendShipQuery,
} = allFriendShipApi;
